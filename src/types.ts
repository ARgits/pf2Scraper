

//
//Content types
//

export interface Data {
    ancestry: ancestryType[];
    background: backgroundType[];
    spell: spellType[];
    action: actionType[];
    feat: featType[];
    creature: creatureType[];
    trait: Set<string>;
    paragraph: Set<string>;
    table: { fullName: string; description: string, data_type: 'table', id: string }[];
    condition: { fullName: string, description: string, id: string, data_type: 'condition' }[]
}
export type rawRuData = {
    checked: { site: string, data: string }[],
    error: []
}
export type Routes =
    keyof Pick<Data, "action" | "background" | "creature" | "feat" | "spell" | "ancestry">
    | "favorites";
export type DataRoutes = Exclude<Routes, "favorites">;
export type notParsedContent = { id: generalContent["id"], aon_url: string, external_ru_url: string, data_type: generalContent["data_type"] } & Partial<generalContent>
export type notParsedCategories = 'armor' | 'class' | 'article' | 'creature_family' | 'deity' | 'equipment' | 'hazard' | 'rules' | 'shield' | 'skill' | 'source' | 'trait' | 'weapon' | 'weapon_group' | 'archetype'
export type generalContent =
    {
        name: string;
        original_name: string;
        trait: string[];
        rarity: "common" | "uncommon" | "rare" | "unique";
        description: string;
        source: string[];
        id: string;
        is_translate_raw: boolean;
        original_desc: string;
        external_ru_url: string;
        aon_url: `https://2e.aonprd.com${string}`,
        remaster_id: string[],
        legacy_id: string[],
        aon_id: string,
        ru_id: string
    }
    & (ancestryProperties | backgroundProperties | spellProperties | featProperties | creatureProperties | actionProperties | classProperties | { data_type: notParsedCategories })

export type contentFromQuery = CustomPick<generalContent, 'description' | 'original_desc' | 'original_name' | 'name' | 'trait' | 'aon_url' | 'external_ru_url' | 'id' | 'is_translate_raw' | 'level'>
export type classType = Extract<generalContent, { data_type: 'class' }>
export type ancestryType = Extract<generalContent, { data_type: 'ancestry' }>
export type backgroundType = Extract<generalContent, { data_type: 'background' }>
export type spellType = Extract<generalContent, { data_type: 'spell' }>
export type featType = Extract<generalContent, { data_type: 'feat' }>
export type creatureType = Extract<generalContent, { data_type: 'creature' }>
export type actionType = Extract<generalContent, { data_type: 'action' }>
export type classKeys = keyof classType
//data specific properties
type ancestryProperties = {
    data_type: "ancestry",
    hp: number,
    size: ("Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan")[];
    reach: number;
    speed: string;
    language: string[],
    additional_languages: {
        count: number,
        value: string[]
    },
    vision: string,
    boosts: ("Intelligence" | "Wisdom" | "Strength" | "Dexterity" | "Charisma" | "Constitution" | "Free")[],
    flaws: ("Intelligence" | "Wisdom" | "Strength" | "Dexterity" | "Charisma" | "Constitution" | "Free")[],
};
type backgroundProperties = {
    data_type: "background",
    attribute: ('Intelligence' | 'Wisdom' | 'Strength' | 'Dexterity' | 'Charisma' | 'Constitution' | 'Free')[];
    feat: string[];
    lore: string[];
    skill: string[];
    feat_markdown: string[];
}
type actionProperties = {
    data_type: "action",
    action: string;
}
type spellProperties = {
    data_type: "spell",
    spell_type: 'Spell' | 'Cantrip' | 'Focus';
    level: number;
    tradition: ('Divine' | 'Occult' | 'Arcane' | 'Primal' | 'Elemental')[];
    action: string;
    casting_type: string[];
    save: string | "";
}
type creatureProperties = {
    data_type: "creature",
    level: number,
    senses: string[],
    languages: string[],
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
    hp: number,
    ac: number,
    fortitude: number,
    reflex: number,
    will: number,
    speed: Speed,
    spells?: string[],
    acrobatics: number;
    athletics: number;
    arcana: number;
    diplomacy: number;
    deception: number;
    intimidation: number;
    stealth: number;
    thievery: number;
    society: number;
    crafting: number;
    perception: number;
    religion: number;
    occultism: number;
    survival: number;
    nature: number;
    performance: number;
    medicine: number;
}
type featProperties = {
    data_type: "feat",
    action: string;
    level: number;
    archetype: string[];
    skill: string[]
}
type itemProperties = {
    data_type: 'item',
    weight: number,
    price: number //цена в медных монетах
    held: ['one', 'two', '-'],
    contain: generalContent["id"][]
    isMagical: boolean,
    isConsumable: boolean,
} & (adventureItem | classKitItem | alchemicalItem)
type adventureItem = {
    itemType: 'adventure',
}
type classKitItem = {
    itemType: 'classKit',
    class: string,
}
type alchemicalItem = {
    itemType: 'alchemical',
    subType: 'bomb' | 'elixir' | 'tool'

}
type classProperties = {
    data_type: 'class'
    hp: number,
    perception: {
        start: proficiencyRankEnum,
        end: proficiencyRankEnum
    },
    will: {
        start: proficiencyRankEnum,
        end: proficiencyRankEnum
    }
    reflex: {
        start: proficiencyRankEnum,
        end: proficiencyRankEnum
    },
    fortitude: {
        start: proficiencyRankEnum,
        end: proficiencyRankEnum
    }

    feat: featType[],
    spellTradition: spellTraditionEnum

}
//
//Filters Type
//
export type filterQueryResult = {
    id: string[],
    enabled: boolean[],
    disabled: boolean[],
    exclude_enabled: boolean[],
    exclude_disabled: boolean[],
    type: KeysOfUnion<generalContent>[],
    data_max: number[],
    data_max_default: number[],
    data_min: number[],
    data_min_default: number[],
    data_group: string,
    option_name: string[],
    filter_name: string
}
//Tabs type
//
type tab = {
    visible: boolean;
    name: string;
    key: keyof Tabs;
    maxItems: number;
};

export interface Tabs {
    feats: tab;
    backgrounds: tab;
    spells: tab;
    actions: tab;
    favorites: tab;
    creatures: tab
}
//
//viewTypes
//
export type columnItem = { key: KeysOfUnion<generalContent>, name: string, isShown: boolean, order: number }
export type columnsObject = { columns: columnItem[], numOfColumns: number }
//
//Utility types
//
export type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];
export type Values<T> = T[keyof T] extends Iterable<infer U> ? U[] : never
export type KeysOfUnion<T> = T extends T ? keyof T : never;
export type CustomPick<T, K extends KeysOfUnion<T>> = { [P in K]: T[P]; }
export type dbFilter = KeysOfUnion<generalContent> extends infer U ? U extends KeysOfUnion<generalContent> ? {
    [k in U]:
    {
        tables: Extract<generalContent, { [k in U]: any }>["data_type"][],
        filter_name: string,
        option_name?: string,
        data_group: string,
        type: 'minMax' | 'singleRadio' | 'multipleRadio',
        is_num: boolean
    }
} : never : never;
export type dbFilterEntries = KeysOfUnion<generalContent> extends infer U ? U extends KeysOfUnion<generalContent> ? [U, {
    tables: Extract<generalContent, { [k in U]: any }>["data_type"][],
    filter_name: string,
    option_name?: string,
    data_group: string,
    type: 'minMax' | 'singleRadio' | 'multipleRadio',
    is_num: boolean
}][] : never : never
//
//Enums
//
enum AttributesEnum {
    str = "str",
    dex = "dex",
    con = "con",
    wis = "wis",
    cha = "cha",
    int = "int"
}

export type SkillMod = {
    acrobatics?: number;   // Modifier for Acrobatics skill
    athletics?: number;    // Modifier for Athletics skill
    arcana?: number;       // Modifier for Arcana skill
    diplomacy?: number;    // Modifier for Diplomacy skill
    deception?: number;    // Modifier for Deception skill
    intimidation?: number; // Modifier for Intimidation skill
    stealth?: number;      // Modifier for Stealth skill
    thievery?: number;     // Modifier for Thievery skill
    society?: number;      // Modifier for Society skill
    crafting?: number;     // Modifier for Crafting skill
    perception?: number;   // Modifier for Perception
    religion?: number;     // Modifier for Religion skill
    occultism?: number;    // Modifier for Occultism skill
    survival?: number;     // Modifier for Survival skill
    nature?: number;       // Modifier for Nature skill
    performance?: number;  // Modifier for Performance skill
    medicine?: number;     // Modifier for Medicine skill
}

enum DefencesEnum {
    ac = "ac",
    fortitude = "fortitude",
    will = "will",
    reflex = "reflex"
}
enum spellTraditionEnum {
    arcane = 'arcane',
    divine = 'divine',
    primal = 'primal',
    occult = 'occult'
}
export interface Speed {
    land?: number;      // Movement speed on land
    fly?: number;       // Flying speed
    swim?: number;      // Swimming speed
    burrow?: number;    // Burrowing speed
    climb?: number;     // Climbing speed
    max?: number;       // Maximum possible speed
}
enum proficiencyRankEnum {
    untrained = "untrained",
    trained = "trained",
    expert = "expert",
    master = "master",
    legend = "legend"
}