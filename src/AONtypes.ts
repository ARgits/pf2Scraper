export interface AONBase {
  category: string;
  exclude_from_search: boolean;
  hp_scale_number?: number;
  id: string;
  legacy_id?: string[];
  markdown: string;
  name: string;
  perception_scale_number?: number;
  primary_source: string;
  primary_source_category: string;
  primary_source_raw: string;
  rarity: "common" | "uncommon" | "rare";
  rarity_id: number;
  release_date: string;
  remaster_id?: string[];
  resistance: Resistance;
  skill?: string[];
  skill_markdown?: string;
  skill_mod: SkillMod;
  source: string[];
  source_category: string[];
  source_markdown: string,
  source_raw: string[],
  speed: Speed;
  speed_markdown?: string;               // Markdown description of speed
  speed_raw?: string;                    // Raw speed value
  summary: string;
  summary_markdown: string;
  trait?: string[]
  text: string;
  url: string;
  weakness: Weakness;
}
export type Attributes = 'Intelligence' | 'Wisdom' | 'Strength' | 'Dexterity' | 'Charisma' | 'Constitution' | 'Free'
export interface Weakness {
  fire?: number;         // Weakness to fire
  cold?: number;         // Weakness to cold
  electricity?: number;  // Weakness to electricity
  slashing?: number;     // Weakness to slashing damage
  bludgeoning?: number;  // Weakness to bludgeoning damage
  piercing?: number;     // Weakness to piercing damage
  sonic?: number;        // Weakness to sonic damage
  poison?: number;       // Weakness to poison
  positive?: number;     // Weakness to positive energy
  negative?: number;     // Weakness to negative energy
  mental?: number;       // Weakness to mental attacks
  good?: number;         // Weakness to good-aligned damage
  evil?: number;         // Weakness to evil-aligned damage
  holy?: number;         // Weakness to holy energy
  unholy?: number;       // Weakness to unholy energy
  silver?: number;       // Weakness to silver
  cold_iron?: number;    // Weakness to cold iron
  lawful?: number;       // Weakness to lawful-aligned damage
  chaotic?: number;      // Weakness to chaotic-aligned damage
  force?: number;        // Weakness to force damage
  spirit?: number;       // Weakness to spirit-based attacks
  splash?: number;       // Weakness to splash damage (area effects)
}
export interface SkillMod {
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
export interface Resistance {
  acid?: number;         // Resistance to acid
  fire?: number;         // Resistance to fire
  cold?: number;         // Resistance to cold
  electricity?: number;  // Resistance to electricity
  poison?: number;       // Resistance to poison
  physical?: number;     // Resistance to physical damage
  force?: number;        // Resistance to force damage
  slashing?: number;     // Resistance to slashing damage
  bludgeoning?: number;  // Resistance to bludgeoning damage
  piercing?: number;     // Resistance to piercing damage
  sonic?: number;        // Resistance to sonic damage
  positive?: number;     // Resistance to positive energy
  negative?: number;     // Resistance to negative energy
  mental?: number;       // Resistance to mental attacks
  good?: number;         // Resistance to good-aligned damage
  evil?: number;         // Resistance to evil-aligned damage
  holy?: number;         // Resistance to holy energy
  unholy?: number;       // Resistance to unholy energy
  splash?: number;       // Resistance to splash damage (area effects)
  orichalcum?: number;   // Resistance to orichalcum material
  silver?: number;       // Resistance to silver
  cold_iron?: number;    // Resistance to cold iron
  lawful?: number;       // Resistance to lawful-aligned damage
  chaotic?: number;      // Resistance to chaotic-aligned damage
}
export interface Speed {
  land?: number;      // Movement speed on land
  fly?: number;       // Flying speed
  swim?: number;      // Swimming speed
  burrow?: number;    // Burrowing speed
  climb?: number;     // Climbing speed
  max?: number;       // Maximum possible speed
}

export interface AONarchetype extends AONBase { }
export interface AONspell extends AONBase {
  actions: string;
  actions_number: number;
  area?: number[];
  area_raw?: string;
  area_type?: string[];
  bloodline?: string[];
  bloodline_markdown: string;
  component?: string[];
  cost?: string;
  cost_markdown?: string;
  deity?: string[];
  deity_markdown?: string;
  domain_markdown: string;
  duration?: number;
  duration_raw?: string;
  element?: string[];
  heighten_group?: string[];
  heighten_level?: number[];
  lesson?: string[];
  lesson_markdown?: string;
  level: number;
  mystery?: string[];
  mystery_markdown?: string;
  patron_theme?: string[];
  patron_theme_markdown?: string;
  pfs?: string;
  range?: number;
  range_raw?: string;
  requirement?: string;
  requirement_markdown?: string;
  saving_throw?: string;
  saving_throw_markdown?: string;
  school?: string;
  spell_type: 'Spell' | 'Cantrip' | 'Focus';
  target?: string;
  target_markdown?: string;
  tradition?: ('Divine' | 'Occult' | 'Arcane' | 'Primal' | 'Elemental')[];
  tradition_markdown: string;
  trait?: string[];
  trait_group?: string[];
  trait_markdown: string;
  trait_raw?: string[];
  trigger?: string;
  trigger_markdown?: string;
}


export interface AONarmor extends AONBase {
  ac: number;                      // Armor Class
  armor_category: string;           // Category of the armor (e.g., light, medium, heavy)
  armor_group_markdown: string;     // Markdown description of the armor group
  bulk: number;                     // Armor's bulk (weight/size)
  item_category: string;            // The category of the item (e.g., armor)
  item_subcategory: string;         // The subcategory of the armor (e.g., shields)
  level: number;                    // The level requirement to use the armor
  armor_group?: string;             // Armor group (optional)
  bulk_raw?: string;                // Raw bulk value (optional)
  dex_cap?: number;                 // Maximum Dexterity bonus allowed by the armor
  price?: number;                   // Price of the armor
  price_raw?: string;               // Raw price value
  strength?: number;                // Strength requirement to wear the armor
  check_penalty?: number;           // Armor check penalty for skill checks
  speed_penalty?: string;           // Movement speed penalty
  access?: string;                  // Special access or conditions for obtaining the armor
  trait?: string[];                 // Traits for the armor
  trait_group?: string[];           // Trait groups for the armor
  trait_raw?: string[];             // Raw traits
}


export interface AONbackground extends AONBase {
  attribute?: Attributes[];             // Attributes associated with the background
  feat?: string[];                  // Feats granted by the background
  feat_markdown?: string;           // Markdown description of the feats
  is_general_background: boolean;   // Whether the background is general
  region?: string;                  // Region associated with the background
  trait?: string[];                 // Traits of the background
  trait_group?: string[];           // Grouped traits
  trait_raw?: string[];             // Raw traits
  prerequisite?: string;            // Prerequisites for the background
  prerequisite_markdown?: string;   // Markdown description of prerequisites
}

export interface AONcreature extends AONBase {
  ac: number;                            // Armor Class
  ac_scale: string;                      // Scale description for AC
  ac_scale_number: number;               // Scaled value of AC
  alignment?: string;                    // Alignment of the creature
  charisma: number;                      // Charisma stat
  charisma_scale: string;                // Scale description for charisma
  charisma_scale_number: number;         // Scaled value of charisma
  constitution: number;                  // Constitution stat
  constitution_scale: string;            // Scale description for constitution
  constitution_scale_number: number;     // Scaled value of constitution
  creature_ability?: string[];           // Creature abilities
  creature_family_markdown: string;      // Markdown description of creature family
  dexterity: number;                     // Dexterity stat
  dexterity_scale: string;               // Scale description for dexterity
  dexterity_scale_number: number;        // Scaled value of dexterity
  fortitude_save: number;                // Fortitude save stat
  fortitude_save_scale: string;          // Scale description for fortitude save
  fortitude_save_scale_number: number;   // Scaled value of fortitude save
  hp: number;                            // Hit points
  hp_raw: string;                        // Raw hit points
  hp_scale: string;                      // Scale description for HP
  immunity?: string[];                   // Immunities
  immunity_markdown?: string;            // Markdown description of immunities
  intelligence: number;                  // Intelligence stat
  intelligence_scale: string;            // Scale description for intelligence
  intelligence_scale_number: number;     // Scaled value of intelligence
  language?: string[];                   // Languages spoken by the creature
  language_markdown: string;             // Markdown description of languages
  level: number;                         // Level of the creature
  npc: boolean;                          // Whether the creature is an NPC
  perception: number;                    // Perception stat
  perception_scale: string;              // Scale description for perception
  pfs?: string;                          // Optional PFS data
  reflex_save: number;                   // Reflex save stat
  reflex_save_scale: string;             // Scale description for reflex save
  reflex_save_scale_number: number;      // Scaled value of reflex save
  resistance_markdown?: string;          // Markdown description for resistances
  sense?: string;                        // Senses of the creature
  sense_markdown?: string;               // Markdown description of senses
  size: Size[];                        // Size of the creature (e.g., medium, large)
  size_id: number[];                     // Numeric identifiers for size

  spell_markdown: string;                // Markdown description of spells
  stealth?: string;                      // Stealth stat
  strength: number;                      // Strength stat
  strength_scale: string;                // Scale description for strength
  strength_scale_number: number;         // Scaled value of strength
  strongest_save: string[];              // Strongest saves of the creature
  vision?: string;                       // Vision description (e.g., darkvision)
  weakest_save: string[];                // Weakest saves of the creature
  will_save: number;                     // Will save stat
  will_save_scale: string;               // Scale description for will save
  will_save_scale_number: number;        // Scaled value of will save
  wisdom: number;                        // Wisdom stat
  wisdom_scale: string;                  // Scale description for wisdom
  wisdom_scale_number: number;           // Scaled value of wisdom
  attack_bonus?: number[];               // Attack bonus values
  attack_bonus_scale?: string[];         // Attack bonus scales
  attack_bonus_scale_number?: number[];  // Scaled values of attack bonuses
  creature_family?: string;              // Creature family
  image?: string[];                      // Images associated with the creature
  spell?: string[];                      // Spells the creature can cast
  spell_dc?: number[];                   // Spell DC values
  spell_dc_scale?: string[];             // Spell DC scales
  spell_dc_scale_number?: number[];      // Scaled values of spell DC
  strike_damage_average?: number[];      // Average strike damage
  strike_damage_scale?: string[];        // Strike damage scales
  strike_damage_scale_number?: number[]; // Scaled values of strike damage
  tradition?: string[];                  // Traditions the creature follows
  remaster_name?: string;                // Optional remaster name
  weakness_markdown?: string;            // Markdown description for weaknesses
  weakness_raw?: string;                 // Raw weakness values
  spell_attack_bonus?: number[];         // Spell attack bonus values
  spell_attack_bonus_scale?: string[];   // Spell attack bonus scales
  spell_attack_bonus_scale_number?: number[]; // Scaled values of spell attack bonuses
  hardness?: number;                     // Hardness value (for constructs, etc.)
  hardness_raw?: string;                 // Raw hardness value
  element?: string[];                    // Associated elemental properties
}

export interface AONfeat extends AONBase {
  actions: string,
  level: number,
  archetype: string[]

}
export interface AONweapon extends AONBase { }
export interface AONaction extends AONBase {
  actions: string,
}
export interface AONancestry extends AONBase {
  attribute: Attributes[],
  attribute_flaw: Attributes[],
  hp: number,
  language: string[],
  size: Size[],
  speed_raw: string,
  vision: string,
}
export type Size = "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan"
export interface Weapon {
  ammunition_markdown?: string
  bulk: number
  category: string
  damage?: string
  damage_die?: number
  damage_type?: string[]
  deity?: string[]
  deity_markdown: string
  exclude_from_search: boolean
  hands?: string
  hp_scale_number: number
  id: string
  item_category: string
  item_subcategory: string
  level: number
  markdown: string
  name: string
  perception_scale_number: number
  pfs?: string
  primary_source: string
  primary_source_raw: string
  primary_source_category: string
  rarity: string
  rarity_id: number
  release_date: string
  remaster_id?: string
  resistance: Resistance5
  search_markdown: string
  skill_mod: SkillMod5
  source: string[]
  source_raw: string[]
  source_category: string[]
  source_markdown: string
  speed: Speed5
  summary: string
  summary_markdown: string
  text: string
  trait?: string[]
  trait_group?: string[]
  trait_markdown: string
  trait_raw?: string[]
  type: string
  url: string
  weakness: Weakness5
  weapon_category: string
  weapon_group: string
  weapon_group_markdown: string
  weapon_type: string
  bulk_raw?: string
  price?: number
  price_raw?: string
  remaster_name?: string
  ammunition?: string
  range?: number
  range_raw?: string
  reload?: number
  reload_raw?: string
  source_group?: string[]
  primary_source_group?: string
  spoilers?: string
  access?: string
  legacy_id?: string
  legacy_name?: string
}

export interface Feat {
  category: string
  exclude_from_search: boolean
  feat: string[]
  feat_markdown: string
  hp_scale_number: number
  id: string
  level: number
  markdown: string
  name: string
  perception_scale_number: number
  pfs?: string
  primary_source: string
  primary_source_raw: string
  primary_source_category: string
  rarity: string
  rarity_id: number
  release_date: string
  remaster_id?: string
  resistance: Resistance6
  search_markdown: string
  skill_mod: SkillMod6
  source: string[]
  source_raw: string[]
  source_category: string[]
  source_markdown: string
  speed: Speed6
  summary: string
  summary_markdown: string
  text: string
  trait: string[]
  trait_group?: string[]
  trait_markdown: string
  trait_raw: string[]
  type: string
  url: string
  weakness: Weakness6
  remaster_name?: string
  actions?: string
  actions_number?: number
  prerequisite?: string
  prerequisite_markdown?: string
  frequency?: string
  trigger?: string
  trigger_markdown?: string
  skill?: string[]
  archetype?: string[]
  requirement?: string
  requirement_markdown?: string
  school?: string
  cost?: string
  cost_markdown?: string
  element?: string[]
  primary_source_group?: string
  source_group?: string[]
  spoilers?: string
  access?: string
  heighten?: string[]
  heighten_group?: string[]
  heighten_level?: number[]
  legacy_id?: string
  legacy_name?: string
}

export interface Action {
  actions?: string
  actions_number?: number
  category: string
  exclude_from_search: boolean
  hp_scale_number: number
  id: string
  markdown: string
  name: string
  perception_scale_number: number
  primary_source: string
  primary_source_raw: string
  primary_source_category: string
  rarity: string
  rarity_id: number
  release_date: string
  resistance: Resistance7
  search_markdown: string
  skill_mod: SkillMod7
  source: string[]
  source_raw: string[]
  source_category: string[]
  source_markdown: string
  speed: Speed7
  summary?: string
  summary_markdown?: string
  text: string
  trait_markdown: string
  trigger?: string
  trigger_markdown?: string
  type: string
  url: string
  weakness: Weakness7
  cost?: string
  cost_markdown?: string
  requirement?: string
  requirement_markdown?: string
  trait?: string[]
  trait_group?: string[]
  trait_raw?: string[]
  frequency?: string
  remaster_id?: string
  remaster_name?: string
  primary_source_group?: string
  source_group?: string[]
  school?: string
  spoilers?: string
  element?: string[]
  legacy_id?: string
  legacy_name?: string
}

export interface Equipment {
  base_item_markdown: string
  bulk: number
  bulk_raw?: string
  category: string
  exclude_from_search: boolean
  hp_scale_number: number
  id: string
  item_category: string
  level: number
  markdown: string
  name: string
  perception_scale_number: number
  pfs?: string
  price?: number
  price_raw?: string
  primary_source: string
  primary_source_raw: string
  primary_source_category: string
  rarity: string
  rarity_id: number
  release_date: string
  remaster_id?: string
  resistance: Resistance8
  search_markdown: string
  skill_mod: SkillMod8
  source: string[]
  source_raw: string[]
  source_category: string[]
  source_markdown: string
  speed: Speed8
  spell_markdown: string
  stage_markdown?: string
  summary?: string
  summary_markdown?: string
  text: string
  trait_markdown: string
  type: string
  url: string
  weakness: Weakness8
  hands?: string
  remaster_name?: string
  skill?: string[]
  access?: string
  trait?: string[]
  trait_group?: string[]
  trait_raw?: string[]
  usage?: string
  usage_markdown?: string
  item_subcategory?: string
  actions?: string
  actions_number?: number
  element?: string[]
  school?: string
  duration?: number
  duration_raw?: string
  onset?: number
  onset_raw?: string
  saving_throw?: string
  saving_throw_markdown?: string
  stage?: string[]
  base_item?: string[]
  ammunition?: string
  ammunition_markdown?: string
  trigger?: string
  trigger_markdown?: string
  requirement?: string
  requirement_markdown?: string
  primary_source_group?: string
  source_group?: string[]
  spoilers?: string
  frequency?: string
  alignment?: string
  spell?: string[]
  legacy_id?: string
  legacy_name?: string
}
