import { defineStore } from 'pinia'
import { computed, ref, watch} from 'vue'
import type { DataRoutes, filterQueryResult, generalContent, KeysOfUnion, Routes } from '@types'
import { useRoute, useRouter } from 'vue-router'
import { devLog } from '@/utils'
import { type Results } from '@electric-sql/pglite'
// import { live, type PGliteWithLive } from "@electric-sql/pglite/live"
import { usePaginationStore } from './pagination'
import { pg as dbObject } from '@/main'
import { useViewStore } from './viewStore'

export const useContentStore = defineStore('content', () => {
  const route = useRoute()
  const router = useRouter()
  const routeName = computed(() => route.name as Routes)
  const filterData = ref<Record<Routes, Results<filterQueryResult>['rows']>>()
  const isDataFetched = ref(false)
  const searchItem = ref('')
  const data_types = ref<{ [k in KeysOfUnion<generalContent>]?: 'text' | 'integer' | 'ARRAY' }>()
  const filterQuery = ref<Record<Routes, string>>()
  const filteredData = ref<Record<Routes, { content: generalContent[]; numOfItems: number }>>()
  const currentContent = computed(() => filteredData.value?.[routeName.value]?.content ?? [])
  const currentFilter = computed(() => filterData.value?.[routeName.value] ?? [])
  const numOfItems = computed(() => {
    devLog('numOfitems', routeName.value)
    return filteredData.value?.[routeName.value]?.numOfItems ?? 0
  })

  const data_type = computed(
    () => (route.name as string).replace('favorite', '').toLowerCase() as DataRoutes
  )

  async function updateTextFilterOption(option: string, data_group: string) {
    if (!dbObject || !isDataFetched.value) return
    devLog('option', option)
    const formattedOption = option.replace(/'/g, "''")
    const result = await dbObject.query(
      `UPDATE data_filter SET enabled=CASE WHEN enabled=FALSE AND disabled = FALSE THEN TRUE ELSE FALSE END, disabled = CASE WHEN enabled = TRUE THEN TRUE ELSE FALSE END WHERE (id='${formattedOption}' AND data_type=$1 and data_group=$2)`,
      [data_type.value, data_group]
    )
    devLog('result', result)
    await setExcludedFilters()
  }
  async function setEnabledTextFilterOption(option: string, data_group: string) {
    if (!dbObject || !isDataFetched.value) return
    devLog('setEnabledTextFilterOption', option)
    const formattedOption = option.replace(/'/g, "''")
    await dbObject.exec(`
            update data_filter set enabled=case when enabled=false then true else false end where (id='${formattedOption}' and data_type='${data_type.value}' and data_group='${data_group}');
            update data_filter set disabled=false where (id='${formattedOption}' and data_type='${data_type.value}' and data_group='${data_group}' and enabled=true);`)
    await setExcludedFilters()
  }
  async function setDisabledTextFilterOption(option: string, data_group: string) {
    if (!dbObject || !isDataFetched.value) return
    devLog('setDisabledTextFilterOption', option)
    const formattedOption = option.replace(/'/g, "''")
    await dbObject.exec(`
            update data_filter set disabled=case when disabled=false then true else false end where (id='${formattedOption}' and data_type='${data_type.value}' and data_group='${data_group}');
            update data_filter set enabled=false where (id='${formattedOption}' and data_type='${data_type.value}' and data_group='${data_group}' and disabled=true);`)
    await setExcludedFilters()
  }
  async function updateMinFilterOption(option: string, value: number, data_group: string) {
    if (!dbObject || !isDataFetched.value) return
    devLog('Update min option:', option, value)
    const formattedOption = option.replace(/'/g, "''")
    const result = await dbObject.query(
      `UPDATE data_filter SET data_min=${value} WHERE (id='${formattedOption}' AND data_type=$1 and data_group=$2)`,
      [data_type.value, data_group]
    )
    devLog('result', result)
    await setExcludedFilters()
  }
  async function updateMaxFilterOption(option: string, value: number, data_group: string) {
    if (!dbObject || !isDataFetched.value) return
    devLog('Update max option:', option, value)
    const formattedOption = option.replace(/'/g, "''")
    const result = await dbObject.query(
      `UPDATE data_filter SET data_max=${value} WHERE (id='${formattedOption}' AND data_type=$1 and data_group=$2)`,
      [data_type.value, data_group]
    )
    devLog('result', result)
    await setExcludedFilters()
  }
  function resetFilter(key: string) {
    if (!dbObject || !isDataFetched.value) return
    devLog('reset filter key', key)
    dbObject
      .exec(
        `
            UPDATE data_filter SET enabled=FALSE WHERE type='${key}' AND data_type='${data_type.value}' and enabled=true; 
            update data_filter set disabled = false where  type='${key}' AND data_type='${data_type.value}' and disabled=true`
      )
      .then(async () => {await setFilter()})
  }
  async function setFilter(routeNameArg?: Routes) {
    if (!dbObject || !filterData.value) return
    const dataType = routeNameArg?.replace('favorite', '').toLowerCase() ?? data_type.value
    devLog('setFilter function')
    devLog('dbObject', dbObject)
    const { rows } = (await dbObject!.query(`
            SELECT
                json_agg(id) as id,
                json_agg(enabled) as enabled,
                json_agg(disabled) as disabled,
                json_agg(exclude_enabled) as exclude_enabled,
                json_agg(exclude_disabled) as exclude_disabled,
                json_agg(type) as type,
                json_agg(data_max) as data_max,
                json_agg(data_min) as data_min,
                json_agg(data_max_default) as data_max_default,
                json_agg(data_min_default) as data_min_default,
                json_agg(option_name ORDER BY CASE WHEN option_name='' THEN id ELSE option_name END ASC) as option_name,
                data_group,
                filter_name
            FROM data_filter
            WHERE
                (data_type='${dataType}' and is_num=FALSE) or
                (data_type='${dataType}' and is_num=TRUE and data_max is not NULL)
            GROUP BY data_group,filter_name
            union all
            SELECT
                json_agg(id ORDER BY id::INT ASC) as id,
                json_agg(enabled) as enabled,
                json_agg(disabled) as disabled,
                json_agg(exclude_enabled) as exclude_enabled,
                json_agg(exclude_disabled) as exclude_disabled,
                json_agg(type) as type,
                json_agg(data_max) as data_max,
                json_agg(data_min) as data_min,
                json_agg(data_max_default) as data_max_default,
                json_agg(data_min_default) as data_min_default,
                json_agg(option_name) as option_name,
                data_group,
                filter_name 
            FROM data_filter
            WHERE data_type='${dataType}' and is_num=TRUE and data_max is NULL
            GROUP BY data_group,filter_name`)) as Results<filterQueryResult>
    devLog('rows', rows)
    filterData.value[routeNameArg ?? routeName.value] = rows
    // filterData.splice(0, filterData.length, ...rows)
    const filterQueryArr = [`data_type='${dataType}'`]
    for (const {
      enabled,
      disabled,
      data_max,
      data_max_default,
      data_min,
      data_min_default,
      type,
      id,
      data_group
    } of rows) {
      const arrayTypeEnabledIds = []
      const arrayTypeDisabledIds = []
      const textTypeEnabledIds = []
      const textTypeDisabledIds = []
      const integerTypeEnabledIds = []
      const integerTypeDisabledIds = []
      for (const ind in type) {
        if (
          enabled[ind] ||
          disabled[ind] ||
          (data_max[ind] !== null && data_max[ind] !== data_max_default[ind]) ||
          (data_min[ind] !== null && data_min[ind] !== data_min_default[ind])
        ) {
          if (data_types.value![type[ind]] === 'ARRAY') {
            if (enabled[ind]) {
              arrayTypeEnabledIds.push(id[ind])
            } else if (disabled[ind]) {
              arrayTypeDisabledIds.push(id[ind])
            }
          } else if (data_types.value![type[ind]] === 'text') {
            if (enabled[ind]) {
              textTypeEnabledIds.push(id[ind])
            } else if (disabled[ind]) {
              textTypeDisabledIds.push(id[ind])
            }
          } else {
            if (data_max[0] === null) {
              if (enabled[ind]) {
                integerTypeEnabledIds.push(id[ind])
              } else if (disabled[ind]) {
                integerTypeDisabledIds.push(id[ind])
              }
            } else {
              filterQueryArr.push(`${type[ind]} BETWEEN ${data_min[ind]} AND ${data_max[ind]}`)
            }
          }
        }
      }
      if (arrayTypeEnabledIds.length) {
        filterQueryArr.push(
          `${data_group} && ARRAY[${arrayTypeEnabledIds.map((i) => `'${i.replace(/'/g, "''")}'`)}]`
        )
      }
      if (arrayTypeDisabledIds.length) {
        filterQueryArr.push(
          ` NOT ${data_group} && ARRAY[${arrayTypeDisabledIds.map((i) => `'${i.replace(/'/g, "''")}'`)}]`
        )
      }
      if (textTypeEnabledIds.length) {
        filterQueryArr.push(
          `${data_group} IN(${textTypeEnabledIds.map((i) => `'${i.replace(/'/g, "''")}'`)})`
        )
      }
      if (textTypeDisabledIds.length) {
        filterQueryArr.push(
          `${data_group} NOT IN(${textTypeDisabledIds.map((i) => `'${i.replace(/'/g, "''")}'`)})`
        )
      }
      if (integerTypeEnabledIds.length) {
        filterQueryArr.push(
          `${data_group} IN(${integerTypeEnabledIds.map((i) => `'${i.replace(/'/g, "''")}'`)})`
        )
      }
      if (integerTypeDisabledIds.length) {
        filterQueryArr.push(
          `${data_group} NOT IN(${integerTypeDisabledIds.map((i) => `'${i.replace(/'/g, "''")}'`)})`
        )
      }
    }
    if (searchItem.value.length) {
      filterQueryArr.push(
        `((LOWER(name) LIKE '%${searchItem.value.toLowerCase()}%') OR (LOWER("original_name") LIKE '%${searchItem.value.toLowerCase()}%'))`
      )
    }

    filterQuery.value![routeNameArg ?? routeName.value] = filterQueryArr.join(' AND ')
    await getData(routeNameArg)
  }
  async function setExcludedFilters() {
    if (!dbObject || !isDataFetched.value) return
    await dbObject!.query(
      `UPDATE data_filter SET exclude_enabled=FALSE where data_type=$1 and exclude_enabled=TRUE`,
      [data_type.value]
    )
    await dbObject!.query(
      `UPDATE data_filter SET exclude_disabled=FALSE where data_type=$1 and exclude_disabled=TRUE`,
      [data_type.value]
    )
    await alternativeExcludedOptions()
    await setFilter()
  }

  async function alternativeExcludedOptions() {
    const enabledFilters = (
      await dbObject.query(
        `SELECT json_agg(id) as id_ar,
                disabled,
                type,
                json_agg(data_max) as data_max,
                json_agg(data_min) as data_min
            FROM data_filter
            WHERE
            data_type='${data_type.value}' AND (enabled=TRUE OR disabled=TRUE OR (data_max IS NOT NULL AND data_max!=data_max_default) OR (data_min IS NOT NULL AND data_min!=data_min_default))
            GROUP BY
                type,
                disabled`
      )
    ).rows as {
      type: KeysOfUnion<generalContent>
      id_ar: string[]
      enabled: boolean
      disabled: boolean
      is_num: boolean
      data_max: number[]
      data_min: number[]
    }[]

    if (!enabledFilters.length) {
      return
    }
    const allFilterTypes = (
      await dbObject.query<{ filter_type: KeysOfUnion<generalContent> }>(
        `select type as filter_type from data_filter where data_type=$1 and data_min is null group by type`,
        [data_type.value]
      )
    ).rows
    //
    const filterSelects = []
    const countFilterArr: { dataType: KeysOfUnion<generalContent>[]; countString: string }[] = []
    const allFilterQueries: Map<`${KeysOfUnion<generalContent>}.disabled`, string> = new Map()
    for (const { filter_type } of allFilterTypes) {
      const countFilterString = [`data_type='${data_type.value}'`]
      for (const { id_ar, type, disabled, data_max, data_min } of enabledFilters) {
        if (type !== filter_type) {
          const query =
            data_types.value![type] === 'integer' && data_max[0] !== null
              ? id_ar
                  .map((val, ind) => `"${val}" BETWEEN ${data_min[ind]} AND ${data_max[ind]}`)
                  .join(' AND ')
              : data_types.value![type] === 'ARRAY'
                ? `${disabled ? ' NOT ' : ''}${type}&&ARRAY[${id_ar.map((val) => `'${val.replace(/'/g, "''")}'`)}]`
                : `${type} ${disabled ? 'NOT' : ''} IN (${id_ar.map((val) => `'${val}'`)})`
          countFilterString.push(query)
          const typeKey =
            `${type}${disabled ? '.disabled' : ''}` as `${KeysOfUnion<generalContent>}.disabled`
          if (!allFilterQueries.has(typeKey)) {
            allFilterQueries.set(typeKey, query)
          }
        }
      }
      if (searchItem.value.length) {
        countFilterString.push(
          `((LOWER(name) LIKE '%${searchItem.value.toLowerCase()}%') OR (LOWER("original_name") LIKE '%${searchItem.value.toLowerCase()}%'))`
        )
      }
      const index = countFilterArr.findIndex(
        (v) => v.countString === countFilterString.join(' and ')
      )
      if (index !== -1) {
        if (data_types.value![filter_type] === 'ARRAY') {
          countFilterArr[index].dataType.push(filter_type)
        } else {
          countFilterArr[index].dataType.unshift(filter_type)
        }
      } else {
        countFilterArr.push({
          dataType: [filter_type],
          countString: countFilterString.join(' and ')
        })
      }
    }
    for (const item of countFilterArr) {
      const isArray = item.dataType.some((v) => data_types.value![v] === 'ARRAY')
      if (isArray) {
        let string = ''
        for (const strInd in item.dataType) {
          const str = item.dataType[strInd]
          const strDataType = data_types.value![str]
          const isLast = parseInt(strInd) === item.dataType.length - 1
          string += strInd === '0' && strDataType !== 'ARRAY' ? 'ARRAY[' : ''
          string += str
          string += strDataType === 'integer' ? '::text' : ''
          if (!isLast) {
            string +=
              strDataType !== 'ARRAY' &&
              data_types.value![item.dataType[parseInt(strInd) + 1]] === 'ARRAY'
                ? ']'
                : ''
            string +=
              data_types.value![item.dataType[parseInt(strInd) + 1]] === 'ARRAY' ? ' || ' : ' , '
          } else {
            string +=
              strDataType !== 'ARRAY' &&
              data_types.value![item.dataType[parseInt(strInd) + 1]] === 'ARRAY'
                ? ']'
                : ''
          }
        }
        filterSelects.push(`unnest(${string})`)
      } else {
        filterSelects.push(
          ...item.dataType.map((v) => (data_types.value![v] === 'integer' ? `${v}::text` : v))
        )
      }
    }
    const finalQueryforEnabled = `select option_id from (${filterSelects.map((v, ind) => `SELECT ${v} as option_id, COUNT(*) FILTER(WHERE ${countFilterArr[ind].countString}) as match_count FROM CONTENT WHERE data_type='${data_type.value}' group by option_id`).join(' union all ')}) where match_count>0`

    const wherePartQuery = [`data_type='${data_type.value}'`, ...allFilterQueries.values()]
    if (searchItem.value.length) {
      wherePartQuery.push(
        `((LOWER(name) LIKE '%${searchItem.value.toLowerCase()}%') OR (LOWER("original_name") LIKE '%${searchItem.value.toLowerCase()}%'))`
      )
    }
    const finalqueryForDisabled = `
            with filtered_content as (
                select
                    ${allFilterTypes.map((v) => v.filter_type)}    
                from content
                where ${wherePartQuery.join(' and ')}
                ),
            total_count as (
                select count(*) as total_rows
                from content
                where ${wherePartQuery.join(' and ')}
            ),
            options_count as (
                ${allFilterTypes
                  .map(
                    (v) => `
                    select
                        '${v.filter_type}.' || unnest(${data_types.value![v.filter_type] === 'ARRAY' ? v.filter_type : `array[${v.filter_type}]`}) as option_id,
                        count(*) as option_occurences
                    from filtered_content
                    group by option_id`
                  )
                  .join(' union all ')}
            )
            select
                split_part(option_id,'.',2)
            from
                options_count, total_count
            where option_occurences=total_rows
            order by option_id`
  }
  async function getData(routeNameArg?: Routes) {
    if (route.name === undefined) return
    if (!dbObject) return
    if (!filteredData.value) return
    const paginationStore = usePaginationStore()
    const { allColumns, currentSortingOrder}= useViewStore()
    const { currentPage, itemsPerPage } = paginationStore
    const currentRoute = routeNameArg ?? routeName.value
    const dataType = routeNameArg?.replace('favorite', '').toLowerCase() ?? data_type.value
    devLog(dataType)
    const arrayAggColumns = Object.entries(data_types.value!)
      .filter(
        ([k, v]) =>
          allColumns![currentRoute].columns.map((v) => v.key).includes(k) &&
          v !== 'integer' &&
          k !== 'name' &&
          k !== 'original_name'
      )
      .map(([k, _]) => k)

    const query = `SELECT id, description, original_desc, external_ru_url, aon_url, ${allColumns![currentRoute].columns.map((v) => v.key)} FROM content WHERE `
    if (currentRoute.includes('favorite')) {
      const localStorageString = localStorage.getItem('favorites')
      const favoriteIds: generalContent['id'][] = localStorageString
        ? (JSON.parse(localStorageString) as { id: string }[]).map((i) => `'${i.id}'`)
        : []
      if (!localStorageString || !favoriteIds.length) {
        // filteredData.value = []
        // numOfItems.value = 0
        return
      }
      const whereQueries = []
      whereQueries.push(`data_type='${dataType}'`)
      whereQueries.push(`id in (${favoriteIds}) or ru_id in (${favoriteIds})`)
      const numOfItems = (
        await dbObject.query<{ count: number }>(
          `SELECT COUNT(*) FROM content WHERE ${whereQueries.join(' AND ')}`
        )
      ).rows[0].count
      dbObject
        .query<generalContent>(
          query +
            `${whereQueries.join(' AND ')} order by ${currentSortingOrder} LIMIT ${itemsPerPage} OFFSET ${currentPage * itemsPerPage}`
        )
        .then((value) => (filteredData.value![currentRoute] = { content: value.rows, numOfItems }))
      return
    }

    const numOfItems = (
      await dbObject.query<{ count: number }>(
        `SELECT COUNT(*) FROM content WHERE ${filterQuery.value![currentRoute]}`
      )
    ).rows[0].count
    const offsetValue = currentPage * itemsPerPage
    //
    devLog(query, dataType, routeNameArg)

    const finalQuery = `
        select 
            c.id,
            c.description,
            c.original_desc,
            c.external_ru_url,
            c.aon_url,
            ${allColumns![currentRoute].columns.filter((v) => !arrayAggColumns.includes(v.key)).map((v) => `c.${v.key}`)},
            ${arrayAggColumns
              .map(
                (v) =>
                  `
            ${v === 'feat' ? 'feat_markdown,' : ''}
            (
                select array_agg(df.option_name)
                from data_filter df
                where
                    df.id = ${data_types.value![v] === 'ARRAY' ? `ANY(c.${v})` : `c.${v}`}
                    and df.type='${v}'
                    and df.data_type='${dataType}') as ${v}`
              )
              .join(', ')}
            from content c
            where ${filterQuery.value![currentRoute]} order by ${currentSortingOrder} LIMIT ${itemsPerPage}${offsetValue ? ` OFFSET ${offsetValue}` : ''}`

    dbObject.query<generalContent>(finalQuery).then((value) => {
      devLog('query result', dataType, routeNameArg)
      filteredData.value![currentRoute] = { content: value.rows, numOfItems }
    })
  }

  async function getItem(id: generalContent['id' | 'aon_url' | 'external_ru_url']) {
    return (
      await dbObject.query<
        Pick<
          generalContent,
          | 'name'
          | 'original_desc'
          | 'original_name'
          | 'aon_url'
          | 'id'
          | 'external_ru_url'
          | 'trait'
        >
      >(
        `
            select 
                c.name,
                c.original_name,
                c.description,
                c.original_desc,
                c.aon_url,
                c.external_ru_url,
                c.id,
                (select array_agg(df.option_name)
                 from data_filter df
                 where
                    df.data_type=c.data_type and
                    df.id = any (c.trait) and
                    df.type = 'trait') as trait
                from content c
                where id=$1 or aon_url like $2 or external_ru_url like $2 limit 1`,
        [id, `%${id}%`]
      )
    ).rows[0]
  }

  async function fetchData() {
    await dbObject.waitReady
    const { initViewTypeArray, getAllColumns } = useViewStore()
    initViewTypeArray()
    await getAllColumns()
    await setdata_types()
    filteredData.value = <Record<Routes, { content: generalContent[]; numOfItems: 0 }>>{}
    filterData.value = <Record<Routes, Results<filterQueryResult>['rows']>>{}
    filterQuery.value = <Record<Routes, string>>{}
    for (const path of router
      .getRoutes()
      .filter((r) => r.name && r.name !== 'content' && r.name !== 'favorite')) {
      const name = path.name as Routes

      await setFilter(name)
    }
    isDataFetched.value = true

    devLog('data types object is set!')
  }
  async function setdata_types() {
    if (!dbObject) return
    const data_typesQueryResult: Results<{
      column_name: KeysOfUnion<generalContent>
      data_type: 'text' | 'ARRAY' | 'integer'
    }> = await dbObject.query(`
            SELECT data_type, column_name
            FROM information_schema.columns 
            WHERE
                table_name ='content'
                AND table_schema = 'public'
            GROUP BY
                column_name, data_type`)

    data_types.value = {}
    for (const row of data_typesQueryResult.rows) {
      data_types.value![row.column_name] = row.data_type
    }
  }
  watch(searchItem, () => setExcludedFilters().then(() => devLog('filter', filterData)))
  return {
    //ref
    filteredData,
    searchItem,
    isDataFetched,
    filterData,

    //computed
    currentContent,
    numOfItems,
    currentFilter,
    routeName,

    //function
    getData,
    getItem,
    fetchData,
    updateTextFilterOption,
    updateMinFilterOption,
    updateMaxFilterOption,
    setEnabledTextFilterOption,
    setDisabledTextFilterOption,
    resetFilter
  }
})
