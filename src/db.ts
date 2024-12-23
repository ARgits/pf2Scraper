import { PGlite } from '@electric-sql/pglite'
import type { dbFilter, generalContent, dbFilterEntries, notParsedContent } from '@types'
import { createData } from './data/dev/prepareData.js'
import * as fs from 'fs/promises'
// import creatures from './data/prod/creatures-1.json' with {type: "json"}
const db = new PGlite()
await db.exec(`
 CREATE TABLE IF NOT EXISTS content (
 is_translate_raw BOOLEAN,
 id TEXT PRIMARY KEY,
 ru_id TEXT,
 description TEXT,
 original_name TEXT,
 data_type TEXT,
 name TEXT,
 rarity TEXT,
 original_desc TEXT,
 aon_id TEXT,
 aon_url TEXT,
 action TEXT,
 spell_type TEXT,
 save TEXT,
 speed TEXT,
 vision TEXT,
 external_ru_url TEXT,
 trait TEXT[],
 remaster_id TEXT[],
 legacy_id TEXT[],
 casting_type TEXT[],
 tradition TEXT[],
 skill TEXT[],
 feat TEXT[],
 feat_markdown TEXT[],
 attribute TEXT[],
 size TEXT[],
 boosts TEXT[],
 flaws TEXT[],
 archetype TEXT[],
 languages TEXT[],
 senses TEXT[],
 source TEXT[],
 level INT,
 reach INT,
 hp INT,
 str INT,
 dex INT,
 con INT,
 wis INT,
 int INT,
 cha INT,
 ac INT,
 fortitude INT,
 reflex INT,
 will INT,
 acrobatics INT,
 athletics INT,
 arcana INT,
 diplomacy INT,
 deception INT,
 intimidation INT,
 stealth INT,
 thievery INT,
 society INT,
 crafting INT,
 perception INT,
 religion INT,
 occultism INT,
 survival INT,
 nature INT,
 performance INT,
 medicine INT,
 burrow INT,
 climb INT,
 land INT,
 fly INT,
 swim INT 
);
  CREATE TABLE IF NOT EXISTS data_filter (
    id TEXT ,
    is_default BOOLEAN,
    enabled BOOLEAN,
    disabled BOOLEAN,
    exclude_enabled BOOLEAN,
    exclude_disabled BOOLEAN,
    is_num BOOLEAN,
    type TEXT,
    data_type TEXT,
    data_group TEXT,
    filter_name TEXT,
    option_name TEXT,
    data_min INT,
    data_min_default INT,
    data_max INT,
    data_max_default INT,
    PRIMARY KEY (id, data_type, type)
  );
  CREATE INDEX data_type_index ON content (data_type);
  CREATE INDEX trait_index ON content USING GIN (trait);
  CREATE INDEX source_index ON content USING GIN (source);
  CREATE INDEX archetype_index ON content USING GIN (archetype);
  CREATE INDEX rarity_index ON content (rarity);
  CREATE INDEX action_index ON content (action);
`)
const { action, ancestry, background, creature, feat, spell, notParsedContent } = createData()
const optionRus = (await import('./RuTerms.json', { with: { type: 'json' } })).default as Record<string, string>

const filterKeys: dbFilter =
{
    rarity: {
        type: 'singleRadio',
        data_group: 'rarity',
        filter_name: 'редкость',
        is_num: false,
        tables: ['action', 'ancestry', 'background', 'spell', 'feat', 'creature']
    },
    source: {
        type: 'multipleRadio',
        data_group: 'source',
        filter_name: 'источник',
        is_num: false,
        tables: ['action', 'ancestry', 'background', 'spell', 'feat', 'creature']
    },
    attribute: {
        type: 'multipleRadio',
        data_group: 'attribute',
        filter_name: 'характеристика',
        is_num: false,
        tables: ['background']
    },
    trait: {
        type: 'multipleRadio',
        data_group: 'trait',
        filter_name: 'признаки',
        is_num: false,
        tables: ['action', 'ancestry', 'background', 'spell', 'feat', 'creature']
    },
    skill: {
        type: 'multipleRadio',
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: false,
        tables: ['background', 'feat']
    },
    level: {
        type: 'singleRadio',
        data_group: 'level',
        filter_name: 'уровень',
        is_num: true,
        tables: ['creature', 'feat', 'spell']
    },
    action: {
        type: 'singleRadio',
        data_group: 'action',
        filter_name: 'действие',
        is_num: false,
        tables: ['action', 'feat', 'spell']
    },
    str: {
        type: 'minMax',
        data_group: 'attribute',
        filter_name: 'характеристики',
        option_name: 'сила',
        is_num: true,
        tables: ['creature']
    },
    dex: {
        type: 'minMax',
        data_group: 'attribute',
        filter_name: 'характеристики',
        option_name: 'ловкость',
        is_num: true,
        tables: ['creature']
    },
    con: {
        type: 'minMax',
        data_group: 'attribute',
        filter_name: 'характеристики',
        option_name: 'телосложение',
        is_num: true,
        tables: ['creature']
    },
    int: {
        type: 'minMax',
        data_group: 'attribute',
        filter_name: 'характеристики',
        option_name: 'интеллект',
        is_num: true,
        tables: ['creature']
    },
    wis: {
        type: 'minMax',
        data_group: 'attribute',
        filter_name: 'характеристики',
        option_name: 'мудрость',
        is_num: true,
        tables: ['creature']
    },
    cha: {
        type: 'minMax',
        data_group: 'attribute',
        filter_name: 'характеристики',
        option_name: 'харизма',
        is_num: true,
        tables: ['creature']
    },
    ac: {
        data_group: "defence",
        filter_name: "защиты",
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'КБ'
    },
    archetype: {
        data_group: 'archetype',
        filter_name: 'Архетип',
        is_num: false,
        tables: ['feat'],
        type: 'multipleRadio',
    },
    casting_type: {
        data_group: 'casting_type',
        filter_name: 'Тип сотворения',
        is_num: false,
        tables: ['spell'],
        type: 'multipleRadio'
    },
    feat: {
        data_group: 'feat',
        filter_name: 'Способности',
        is_num: false,
        tables: ['background'],
        type: 'multipleRadio'
    },
    boosts: {
        data_group: 'boosts',
        filter_name: 'Повышения характеристики',
        is_num: false,
        tables: ['ancestry'],
        type: 'multipleRadio'
    },
    flaws: {
        data_group: 'flaws',
        filter_name: 'Недостаток характеристик',
        is_num: false,
        tables: ['ancestry'],
        type: 'multipleRadio'
    },
    hp: {
        data_group: 'hp',
        filter_name: 'здоровье',
        is_num: true,
        tables: ['ancestry', 'creature', 'class'],
        type: 'minMax'
    },
    fortitude: {
        data_group: 'defence',
        filter_name: 'защиты',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'стойкость'
    },
    reflex: {
        data_group: 'defence',
        filter_name: 'защиты',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'рефлекс'
    },
    tradition: {
        data_group: 'tradition',
        filter_name: 'традиция',
        is_num: false,
        tables: ['spell'],
        type: 'multipleRadio'
    },
    will: {
        data_group: 'defence',
        filter_name: 'защиты',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'воля'
    },
    spell_type: {
        data_group: 'spell_type',
        filter_name: 'тип заклинания',
        is_num: false,
        tables: ['spell'],
        type: 'singleRadio'
    },
    perception: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'восприятие'
    },
    acrobatics: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'акробатика'
    },
    arcana: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'аркана'
    },
    athletics: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'атлетика'
    },
    crafting: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'ремесло'
    },
    deception: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'обман'
    },
    diplomacy: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'дипломатия'
    },
    intimidation: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'запугивание'
    },
    medicine: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'медицина'
    },
    thievery: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'воровство'
    },
    nature: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'природа'
    },
    occultism: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'оккультизм'
    },
    performance: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'выступление'
    },
    religion: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'религия'
    },
    society: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'общество'
    },
    stealth: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'скрытность'
    },
    survival: {
        data_group: 'skill',
        filter_name: 'навыки',
        is_num: true,
        tables: ['creature'],
        type: 'minMax',
        option_name: 'выживание'
    }
}
async function insertDataToContentDB(array: generalContent[] | notParsedContent[]) {
    const validKeys = (await db.exec(`SELECT * FROM content`))[0].fields.map(f => f.name)
    const queryBegin = `INSERT INTO content (${validKeys.map(key => `"${key}"`).toString()})
                            VALUES (${validKeys.map((_, index) => `$${index + 1}`)})`
    
    for (const item of array) {
        const queryParams = Array.from({ length: validKeys.length })
        for (const [key, val] of Object.entries(item)) {
            if ((typeof val !== 'boolean' && val['length'] !== undefined) || typeof val === 'number' || typeof val === 'boolean') {
                if (!validKeys.includes(key)) continue
                const index = validKeys.findIndex((v) => v === key)
                queryParams[index] = val
            } else {
                for (const [k, v] of Object.entries((val as Record<string, never>))) {
                    if (!validKeys.includes(k)) continue
                    const index = validKeys.findIndex((validKey) => validKey === k)
                    queryParams[index] = v
                }
            }
        }
        try {
            await db.query(queryBegin, queryParams)
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }
}
async function insertDataToFilterDB(dataType: generalContent["data_type"]) {

    for (const [key, filter] of Object.entries(filterKeys) as unknown as dbFilterEntries) {
        try {
            if ((filter.tables as generalContent['data_type'][]).includes(dataType)) {
                if (filter.type === 'minMax') {
                    const { min, max } = (await db.query<{ min: number, max: number }>(`select min(${key}), max(${key}) from content where data_type=$1`, [dataType])).rows[0]
                    await db.query(`INSERT INTO data_filter VALUES ($1,$2,$2,$2,$2,$2,$3,$4,$5,$6,$7,$8,$9,$9,$10,$10)`, [key, false, filter.is_num, key, dataType, filter.data_group, filter.filter_name, filter.option_name ?? "", min, max])
                } else {
                    const options = (await db.query<{ option: string | number }>(`select distinct ${filter.type === 'multipleRadio' ? `unnest(${key})` : key} as option from content where data_type=$1`, [dataType])).rows.map((v) => v.option)
                    for (const option of options) {
                        const optionName = optionRus[`${key}.${option?.toString().toLowerCase()}`] ?? option
                        await db.query(`INSERT INTO data_filter VALUES ($1,$2,$2,$2,$2,$2,$3,$4,$5,$6,$7,$8,$9,$9,$9,$9)`, [option, false, filter.is_num, key, dataType, filter.data_group, filter.filter_name, optionName ?? "", null])
                    }
                }
            }
        }

        catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }
}
await insertDataToContentDB(creature)
await insertDataToContentDB(spell)
await insertDataToContentDB(ancestry)
await insertDataToContentDB(background)
await insertDataToContentDB(action)
await insertDataToContentDB(feat)
await insertDataToContentDB(notParsedContent)
await insertDataToFilterDB('creature')
await insertDataToFilterDB('spell')
await insertDataToFilterDB('ancestry')
await insertDataToFilterDB('background')
await insertDataToFilterDB('action')
await insertDataToFilterDB('feat')
try {
    const dbDump = await db.dumpDataDir()
    const saveBuffer = Buffer.from(await dbDump.arrayBuffer())
    fs.writeFile('./public/db.tar.gz', saveBuffer).then(() => {
        db.close().then(() =>{console.log('db is closed')
    })})
} catch (error) {
    if (error instanceof Error) {
    console.log(error.message)
    }
} finally {
    console.log('done')
}
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
`with tab as
  (select id from my_tabs where enabled=true),
  ord as
    (select id, type from ordering where enabled=true)
select * from (
  select name, description, trait, "original_name"
    from spell
    where (select id from tab)='spell'
  union all
  select name, description, trait, "original_name"
    from background
    where
      (select id from tab)='background'
  union all
  select name, description, trait, "original_name"
    from action
    where (select id from tab)='action'
)
order by
  case when (select type from ord)='ASC'
    then
      case when (select id from ord)='name'
        then name
        else "original_name"
      end
    else '1900-01-01'
    end asc,
  case when (SELECT type from ord)='DESC'
    then
      case when (select id from ord)='name'
        then name
        else "original_name"
      end
    else '1900-01-01'
  end desc`
    ;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
`CREATE TABLE IF NOT EXISTS creature (
    id TEXT PRIMARY KEY,
    description TEXT,
    "original_name" TEXT,
    "data_type" TEXT,
    name TEXT,
    level INT,
    hp INT,
    str INT,
    dex INT,
    con INT,
    wis INT,
    int INT,
    cha INT,
    ac INT,
    fortitude INT,
    reflex INT,
    will INT,
    languages TEXT [],
    senses TEXT [],
    rarity TEXT,
    acrobatics INT,   
  athletics INT,    
  arcana INT,       
  diplomacy INT,    
  deception INT,    
  intimidation INT, 
  stealth INT,      
  thievery INT,     
  society INT,      
  crafting INT,     
  perception INT,
  religion INT,     
  occultism INT,    
  survival INT,     
  nature INT,       
  performance INT,  
  medicine INT,     
    burrow INT,
    climb INT,
    land INT,
    fly INT,
    swim INT,
    source TEXT [],
    "is_translate_raw" BOOLEAN,
    "original_desc" TEXT,
    trait TEXT [],
    remaster_id TEXT[],
    legacy_id TEXT[],
    aon_id TEXT,
    aon_url TEXT
  );
  CREATE TABLE IF NOT EXISTS feat (
    id TEXT PRIMARY KEY,
    "original_name" TEXT,
    "data_type" TEXT,
    name TEXT,
    "is_translate_raw" BOOLEAN,
    rarity TEXT,
    "original_desc" TEXT,
    trait TEXT [],
    level INT,
    action TEXT,
    archetype TEXT[],
    skill TEXT [],
    description TEXT,
    source TEXT[],
    remaster_id TEXT[],
    legacy_id TEXT[],
    aon_id TEXT,
    aon_url TEXT
);
  CREATE TABLE IF NOT EXISTS spell (
    id TEXT PRIMARY KEY,
    "original_name" TEXT,
    "data_type" TEXT,
    name TEXT,
    "is_translate_raw" BOOLEAN,
    rarity TEXT,
    "original_desc" TEXT,
    trait TEXT [],
    level INT,
    action TEXT,
    type TEXT,
    description TEXT,
    tradition TEXT [],
    source TEXT [],
    "castingType" TEXT [],
    save TEXT,
    remaster_id TEXT[],
    legacy_id TEXT[],
    aon_id TEXT,
    aon_url TEXT
  );
  CREATE TABLE IF NOT EXISTS action (
    id TEXT PRIMARY KEY,
    "original_name" TEXT,
    "data_type" TEXT,
    name TEXT,
    "is_translate_raw" BOOLEAN,
    rarity TEXT,
    "original_desc" TEXT,
    trait TEXT [],
    action TEXT,
    description TEXT,
    source TEXT [],
    remaster_id TEXT[],
    legacy_id TEXT[],
    aon_id TEXT,
    aon_url TEXT
  );
  CREATE TABLE IF NOT EXISTS background (
    id TEXT PRIMARY KEY,
    "original_name" TEXT,
    "data_type" TEXT,
    name TEXT,
    "is_translate_raw" BOOLEAN,
    rarity TEXT,
    "original_desc" TEXT,
    trait TEXT [],
    action TEXT,
    description TEXT,
    source TEXT [],
    attribute TEXT [],
    skill TEXT [],
    feat TEXT [],
   remaster_id TEXT[],
    legacy_id TEXT[],
    aon_id TEXT,
    aon_url TEXT
  );
  CREATE TABLE IF NOT EXISTS ancestry (
    id TEXT PRIMARY KEY,
    "original_name" TEXT,
    "data_type" TEXT,
    name TEXT,
    "is_translate_raw" BOOLEAN,
    rarity TEXT,
    "original_desc" TEXT,
    trait TEXT [],
    description TEXT,
    source TEXT [],
    hp INT,
    size TEXT [],
    speed TEXT,
    vision TEXT,
    reach INT,
    boosts TEXT [],
    flaws TEXT [],
    remaster_id TEXT[],
    legacy_id TEXT[],
    aon_id TEXT,
    aon_url TEXT
  );
    CREATE INDEX trait_index_background ON background USING GIN (trait);
  CREATE INDEX source_index_background ON background USING GIN (source);
  CREATE INDEX trait_index_spell ON spell USING GIN (trait);
  CREATE INDEX source_index_spell ON spell USING GIN (source);
  CREATE INDEX trait_index_feat ON feat USING GIN (trait);
  CREATE INDEX source_index_feat ON feat USING GIN (source);
  CREATE INDEX trait_index_action ON action USING GIN (trait);
  CREATE INDEX source_index_action ON action USING GIN (source);
  CREATE INDEX trait_index_ancestry ON ancestry USING GIN (trait);
  CREATE INDEX source_index_ancestry ON ancestry USING GIN (source);
  CREATE INDEX trait_index_creature ON creature USING GIN (trait);
  CREATE INDEX source_index_creature ON creature USING GIN (source);`;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
`WITH AggregatedData AS (
    SELECT 
        c.id,
        array_agg(df.option_name) FILTER (WHERE df.id = ANY(c.trait) AND df.data_type = 'spell' AND df.type = 'trait') AS trait,
        array_agg(df.option_name) FILTER (WHERE df.id = ANY(c.source) AND df.data_type = 'spell' AND df.type = 'source') AS source,
        array_agg(df.option_name) FILTER (WHERE df.id = ANY(c.tradition) AND df.data_type = 'spell' AND df.type = 'tradition') AS tradition
    FROM 
        content c
    JOIN 
        data_filter df ON df.data_type = 'spell'
    GROUP BY 
        c.id
),
singleData as (
select c.id, case when df.id=c.action and df.type='action' then df.option_name end as action from content c join data_filter df on df.data_type='spell' 
)
SELECT 
    c.description,
    c.original_desc,
    c.aon_url,
    c.external_ru_url,
    c.id,
    c.name,
    c.original_name,
    c.level,
    ad.trait,
    ad.source,
    ad.tradition,
    sd.action
FROM 
    content c
JOIN 
    AggregatedData ad ON c.id = ad.id
Join
    singleData sd on c.id=sd.id
    where c.data_type='spell' and c.trait && array['attack']
LIMIT 50;`