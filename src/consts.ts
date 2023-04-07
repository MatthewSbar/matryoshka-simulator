// TODO: Add mod families to prevent issues

import { notables } from "./notables";
import { AffixFamily, AffixTierRoll, Influence, Item, Quality } from "./types";

const getRandomNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const chooseWeighted = <T>(items: T[], weightSelector: (item: T) => number): T => {
  const totalWeight = items.reduce((sum, item) => sum + weightSelector(item), 0);
  let randomWeight = Math.random() * totalWeight;

  for (const item of items) {
    randomWeight -= weightSelector(item);
    if (randomWeight < 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

function rollAffixTier(affixFamiliy: AffixFamily): AffixTierRoll {
  const tier = chooseWeighted(affixFamiliy.tiers, tier => tier.weight);

  const roll1 = getRandomNumberInRange(tier.roll1min, tier.roll1max);
  const roll2 = tier.roll2min !== undefined && tier.roll2max !== undefined
    ? getRandomNumberInRange(tier.roll2min, tier.roll2max)
    : undefined;

  return {
    name: affixFamiliy.name,
    tags: affixFamiliy.tags,
    roll1,
    roll2,
  };
}

export const newAmulet = (): Item => {
  const influence = getRandomElement<Influence>(influences)
  const affixFamilies = [
    ...getRandomUniqueAffixes([...prefixModFamilies, ...influencePrefixMap[influence]]),
    ...getRandomUniqueAffixes([...suffixModFamilies, ...influenceSuffixMap[influence]])
  ]

  return   {
    implicitRoll: generateImplicitRoll(),
    influence,
    quality: getRandomElement<Quality>(qualities),
    modifiers: affixFamilies.map(af => rollAffixTier(af)),
    anoints: getRandomUniqueAnointments()
  }
}

const generateImplicitRoll = () => {
    const min = 10;
    const max = 16;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const getRandomUniqueAnointments = () => {
  const shuffledArray = notables.slice();
  for (let i = notables.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray.slice(0, 4);
}

const getRandomUniqueAffixes = (affixArray: AffixFamily[]) => {
  const selectedItems = new Set<number>();
  const selectedIds = new Set<string>();

  while (selectedItems.size < 3) {
    const filteredAffixArray = affixArray.filter((item, index) => !selectedIds.has(item.id) && !selectedItems.has(index));
    const totalWeight = filteredAffixArray.reduce((sum, item) => sum + item.weight, 0);
    let randomWeight = Math.random() * totalWeight;

    for (let i = 0; i < filteredAffixArray.length; i++) {
      randomWeight -= filteredAffixArray[i].weight;
      if (randomWeight < 0) {
        const originalIndex = affixArray.indexOf(filteredAffixArray[i]);
        selectedItems.add(originalIndex);
        selectedIds.add(filteredAffixArray[i].id);
        break;
      }
    }
  }

  return Array.from(selectedItems).map((index) => affixArray[index]);
};

export const formatAffixTierRoll = (affixTierRoll: AffixTierRoll, quality: boolean): string => {
  let { name, roll1, roll2 } = affixTierRoll;
  
  if (quality) {
    roll1 = Math.floor(roll1 * 1.2)
    if (roll2) {
      roll2 = Math.floor(roll2 * 1.2)
    }
  }
  let formattedName = name.replace("#", roll1.toString());

  if (roll2 !== undefined) {
    formattedName = formattedName.replace("#", roll2.toString());
  }

  return formattedName;
}

const influences: Influence[] = [
  "Shaper",
  "Elder",
  "Crusader",
  "Redeemer",
  "Hunter",
  "Warlord",
];

const qualities: Quality[] = [
  "Attribute",
  "Attack",
  "Resistance",
  "Life and Mana",
  "Caster",
  "Defense",
  "Elemental Damage",
  "Speed",
  "Critical",
  "Physical and Chaos Damage",
];

const prefixModFamilies: AffixFamily[] = [
  {
    id: 'IncreasedPhysicalDamageReductionRatingPercent',
    name: '#% increased Armour',
    weight: 7000,
    tags: [
      'Defense'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 4,
        roll1max: 8
      },
      {
        weight: 1000,
        roll1min: 9,
        roll1max: 13
      },
      {
        weight: 1000,
        roll1min: 14,
        roll1max: 18
      },
      {
        weight: 1000,
        roll1min: 19,
        roll1max: 23
      },
      {
        weight: 1000,
        roll1min: 24,
        roll1max: 28
      },
      {
        weight: 1000,
        roll1min: 29,
        roll1max: 32
      },
      {
        weight: 1000,
        roll1min: 33,
        roll1max: 36
      }
    ]
  },
  {
    id: 'IncreasedWeaponElementalDamagePercent',
    name: '#% increased Elemental Damage with Attack Skills',
    weight: 1500,
    tags: [
      'Elemental Damage',
      'Attack'
    ],
    tiers: [
      {
        weight: 300,
        roll1min: 5,
        roll1max: 10
      },
      {
        weight: 300,
        roll1min: 11,
        roll1max: 20
      },
      {
        weight: 300,
        roll1min: 21,
        roll1max: 30
      },
      {
        weight: 300,
        roll1min: 31,
        roll1max: 36
      },
      {
        weight: 300,
        roll1min: 37,
        roll1max: 42
      }
    ]
  },
  {
    id: 'EvasionRatingPercent',
    name: '#% increased Evasion Rating',
    weight: 7000,
    tags: [
      'Defense'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 4,
        roll1max: 8
      },
      {
        weight: 1000,
        roll1min: 9,
        roll1max: 13
      },
      {
        weight: 1000,
        roll1min: 14,
        roll1max: 18
      },
      {
        weight: 1000,
        roll1min: 19,
        roll1max: 23
      },
      {
        weight: 1000,
        roll1min: 24,
        roll1max: 28
      },
      {
        weight: 1000,
        roll1min: 29,
        roll1max: 32
      },
      {
        weight: 1000,
        roll1min: 33,
        roll1max: 36
      }
    ]
  },
  {
    id: 'EnergyShieldPercent',
    name: '#% increased maximum Energy Shield',
    weight: 7000,
    tags: [
      'Defense'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 2,
        roll1max: 4
      },
      {
        weight: 1000,
        roll1min: 5,
        roll1max: 7
      },
      {
        weight: 1000,
        roll1min: 8,
        roll1max: 10
      },
      {
        weight: 1000,
        roll1min: 11,
        roll1max: 13
      },
      {
        weight: 1000,
        roll1min: 14,
        roll1max: 16
      },
      {
        weight: 1000,
        roll1min: 17,
        roll1max: 19
      },
      {
        weight: 1000,
        roll1min: 20,
        roll1max: 22
      },
    ]
  },
  {
    id: 'ItemFoundRarityIncreasePrefix',
    name: '#% increased Rarity of Items found',
    weight: 4000,
    tags: [],
    tiers: [
      {
        weight: 1000,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 1000,
        roll1min: 13,
        roll1max: 18
      },
      {
        weight: 1000,
        roll1min: 19,
        roll1max: 24
      },
      {
        weight: 1000,
        roll1min: 25,
        roll1max: 28
      }
    ]
  },
  {
    id: 'SpellDamage',
    name: '#% increased Spell Damage',
    weight: 5000,
    tags: [
      'Caster'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 3,
        roll1max: 7
      },
      {
        weight: 1000,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 1000,
        roll1min: 13,
        roll1max: 17
      },
      {
        weight: 1000,
        roll1min: 18,
        roll1max: 22
      },
      {
        weight: 1000,
        roll1min: 23,
        roll1max: 26
      }
    ]
  },
  {
    id: 'LifeLeech',
    name: '+#% of Physical Attack Damage Leeched as Life',
    weight: 1750,
    tags: [
      'Attack',
      'Physical and Chaos Damage',
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 0.2,
        roll1max: 0.4
      },
      {
        weight: 500,
        roll1min: 0.6,
        roll1max: 0.8
      },
      {
        weight: 250,
        roll1min: 1,
        roll1max: 1.2
      }
    ]
  },
  {
    id: 'ManaLeech',
    name: '+#% of Physical Attack Damage Leeched as Mana',
    weight: 2000,
    tags: [
      'Attack',
      'Physical and Chaos Damage',
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 0.2,
        roll1max: 0.4
      },
      {
        weight: 1000,
        roll1min: 0.6,
        roll1max: 0.8
      }
    ]
  },
  {
    id: 'GlobalDamageTypeGemLevel',
    name: '+1 to Level of all Fire Skill Gems',
    weight: 200,
    tags: [],
    tiers: [
      {
        weight: 200,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GlobalDamageTypeGemLevel',
    name: '+1 to Level of all Cold Skill Gems',
    weight: 200,
    tags: [],
    tiers: [
      {
        weight: 200,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GlobalDamageTypeGemLevel',
    name: '+1 to Level of all Lightning Skill Gems',
    weight: 200,
    tags: [],
    tiers: [
      {
        weight: 200,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GlobalDamageTypeGemLevel',
    name: '+1 to Level of all Chaos Skill Gems',
    weight: 200,
    tags: [],
    tiers: [
      {
        weight: 200,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GlobalDamageTypeGemLevel',
    name: '+1 to Level of all Physical Skill Gems',
    weight: 200,
    tags: [],
    tiers: [
      {
        weight: 200,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GlobalSkillGemLevel',
    name: '+1 to Level of all Skill Gems',
    weight: 50,
    tags: [],
    tiers: [
      {
        weight: 50,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'IncreasedEnergyShield',
    name: '+# to maximum Energy Shield',
    weight: 1200,
    tags: [
      'Defense'  
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 1,
        roll1max: 3
      },
      {
        weight: 1000,
        roll1min: 4,
        roll1max: 8
      },
      {
        weight: 1000,
        roll1min: 9,
        roll1max: 12
      },
      {
        weight: 1000,
        roll1min: 13,
        roll1max: 15
      },
      {
        weight: 1000,
        roll1min: 16,
        roll1max: 19
      },
      {
        weight: 1000,
        roll1min: 20,
        roll1max: 22
      },
      {
        weight: 1000,
        roll1min: 23,
        roll1max: 26
      },
      {
        weight: 1000,
        roll1min: 27,
        roll1max: 31
      },
      {
        weight: 1000,
        roll1min: 32,
        roll1max: 37
      },
      {
        weight: 1000,
        roll1min: 38,
        roll1max: 43
      },
      {
        weight: 1000,
        roll1min: 44,
        roll1max: 47
      },
      {
        weight: 1000,
        roll1min: 48,
        roll1max: 51
      },
    ]
  },
  {
    id: 'IncreasedLife',
    name: '+# to maximum Life',
    weight: 9000,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 3,
        roll1max: 9
      },
      {
        weight: 1000,
        roll1min: 10,
        roll1max: 19
      },
      {
        weight: 1000,
        roll1min: 20,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 39
      },
      {
        weight: 1000,
        roll1min: 40,
        roll1max: 49
      },
      {
        weight: 1000,
        roll1min: 50,
        roll1max: 59
      },
      {
        weight: 1000,
        roll1min: 60,
        roll1max: 69
      },
      {
        weight: 1000,
        roll1min: 70,
        roll1max: 79
      },
      {
        weight: 1000,
        roll1min: 80,
        roll1max: 89
      }
    ]
  },
  {
    id: 'IncreasedMana',
    name: '+# to maximum Mana',
    weight: 1300,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 15,
        roll1max: 19
      },
      {
        weight: 1000,
        roll1min: 20,
        roll1max: 24
      },
      {
        weight: 1000,
        roll1min: 25,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 34
      },
      {
        weight: 1000,
        roll1min: 35,
        roll1max: 39
      },
      {
        weight: 1000,
        roll1min: 40,
        roll1max: 44
      },
      {
        weight: 1000,
        roll1min: 45,
        roll1max: 49
      },
      {
        weight: 1000,
        roll1min: 50,
        roll1max: 54
      },
      {
        weight: 1000,
        roll1min: 55,
        roll1max: 59
      },
      {
        weight: 1000,
        roll1min: 60,
        roll1max: 64
      },
      {
        weight: 1000,
        roll1min: 65,
        roll1max: 68
      },
      {
        weight: 1000,
        roll1min: 69,
        roll1max: 73
      },
      {
        weight: 1000,
        roll1min: 74,
        roll1max: 78
      },
    ]
  },
  {
    id: 'ColdDamage',
    name: 'Adds # to # Cold Damage to Attacks',
    weight: 4250,
    tags: [
      'Elemental Damage',
      'Attack'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1,
        roll2min: 2,
        roll2max: 2
      },
      {
        weight: 500,
        roll1min: 3,
        roll1max: 4,
        roll2min: 7,
        roll2max: 8
      },
      {
        weight: 500,
        roll1min: 5,
        roll1max: 7,
        roll2min: 10,
        roll2max: 12
      },
      {
        weight: 500,
        roll1min: 6,
        roll1max: 9,
        roll2min: 13,
        roll2max: 16
      },
      {
        weight: 500,
        roll1min: 8,
        roll1max: 11,
        roll2min: 16,
        roll2max: 19
      },
      {
        weight: 500,
        roll1min: 10,
        roll1max: 13,
        roll2min: 20,
        roll2max: 24
      },
      {
        weight: 500,
        roll1min: 12,
        roll1max: 16,
        roll2min: 24,
        roll2max: 28
      },
      {
        weight: 500,
        roll1min: 14,
        roll1max: 19,
        roll2min: 29,
        roll2max: 34
      },
      {
        weight: 250,
        roll1min: 17,
        roll1max: 22,
        roll2min: 34,
        roll2max: 40
      },
    ]
  },
  {
    id: 'FireDamage',
    name: 'Adds # to # Fire Damage to Attacks',
    weight: 4250,
    tags: [
      'Elemental Damage',
      'Attack'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1,
        roll2min: 2,
        roll2max: 2
      },
      {
        weight: 500,
        roll1min: 3,
        roll1max: 5,
        roll2min: 7,
        roll2max: 8
      },
      {
        weight: 500,
        roll1min: 5,
        roll1max: 7,
        roll2min: 11,
        roll2max: 13
      },
      {
        weight: 500,
        roll1min: 7,
        roll1max: 10,
        roll2min: 15,
        roll2max: 18
      },
      {
        weight: 500,
        roll1min: 9,
        roll1max: 12,
        roll2min: 19,
        roll2max: 22
      },
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15,
        roll2min: 23,
        roll2max: 27
      },
      {
        weight: 500,
        roll1min: 13,
        roll1max: 18,
        roll2min: 27,
        roll2max: 31
      },
      {
        weight: 500,
        roll1min: 16,
        roll1max: 22,
        roll2min: 32,
        roll2max: 38
      },
      {
        weight: 250,
        roll1min: 19,
        roll1max: 25,
        roll2min: 39,
        roll2max: 45
      },
    ]
  },
  {
    id: 'LightningDamage',
    name: 'Adds # to # Lightning Damage to Attacks',
    weight: 4250,
    tags: [
      'Elemental Damage',
      'Attack'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1,
        roll2min: 5,
        roll2max: 5
      },
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1,
        roll2min: 14,
        roll2max: 15
      },
      {
        weight: 500,
        roll1min: 1,
        roll1max: 2,
        roll2min: 22,
        roll2max: 23
      },
      {
        weight: 500,
        roll1min: 1,
        roll1max: 2,
        roll2min: 27,
        roll2max: 28
      },
      {
        weight: 500,
        roll1min: 1,
        roll1max: 3,
        roll2min: 33,
        roll2max: 34
      },
      {
        weight: 500,
        roll1min: 1,
        roll1max: 4,
        roll2min: 40,
        roll2max: 43
      },
      {
        weight: 500,
        roll1min: 2,
        roll1max: 5,
        roll2min: 47,
        roll2max: 50
      },
      {
        weight: 500,
        roll1min: 3,
        roll1max: 6,
        roll2min: 57,
        roll2max: 61
      },
      {
        weight: 250,
        roll1min: 3,
        roll1max: 7,
        roll2min: 68,
        roll2max: 72
      },
    ]
  },
  {
    id: 'PhysicalDamage',
    name: 'Adds # to # Physical Damage to Attacks',
    weight: 9000,
    tags: [
      'Attack',
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 1,
        roll1max: 1,
        roll2min: 2,
        roll2max: 2
      },
      {
        weight: 1000,
        roll1min: 2,
        roll1max: 3,
        roll2min: 4,
        roll2max: 5
      },
      {
        weight: 1000,
        roll1min: 3,
        roll1max: 4,
        roll2min: 6,
        roll2max: 7
      },
      {
        weight: 1000,
        roll1min: 4,
        roll1max: 6,
        roll2min: 9,
        roll2max: 10
      },
      {
        weight: 1000,
        roll1min: 5,
        roll1max: 7,
        roll2min: 11,
        roll2max: 12
      },
      {
        weight: 1000,
        roll1min: 6,
        roll1max: 9,
        roll2min: 13,
        roll2max: 15
      },
      {
        weight: 1000,
        roll1min: 7,
        roll1max: 10,
        roll2min: 15,
        roll2max: 18
      },
      {
        weight: 1000,
        roll1min: 9,
        roll1max: 12,
        roll2min: 19,
        roll2max: 22
      },
      {
        weight: 1000,
        roll1min: 11,
        roll1max: 15,
        roll2min: 22,
        roll2max: 26
      },
    ]
  }
];

const suffixModFamilies: AffixFamily[] = [
  {
    id: 'Strength',
    name: "+# to Strength",
    weight: 9000,
    tags: ['Attribute'],
    tiers: [
      {
        weight: 1000,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 1000,
        roll1min: 13,
        roll1max: 17
      },
      {
        weight: 1000,
        roll1min: 18,
        roll1max: 22
      },
      {
        weight: 1000,
        roll1min: 23,
        roll1max: 27
      },
      {
        weight: 1000,
        roll1min: 28,
        roll1max: 32
      },
      {
        weight: 1000,
        roll1min: 33,
        roll1max: 37
      },
      {
        weight: 1000,
        roll1min: 38,
        roll1max: 42
      },
      {
        weight: 1000,
        roll1min: 43,
        roll1max: 50
      },
      {
        weight: 1000,
        roll1min: 51,
        roll1max: 55
      }
    ]
  },
  {
    id: 'Dexterity',
    name: "+# to Dexterity",
    weight: 9000,
    tags: ['Attribute'],
    tiers: [
      {
        weight: 1000,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 1000,
        roll1min: 13,
        roll1max: 17
      },
      {
        weight: 1000,
        roll1min: 18,
        roll1max: 22
      },
      {
        weight: 1000,
        roll1min: 23,
        roll1max: 27
      },
      {
        weight: 1000,
        roll1min: 28,
        roll1max: 32
      },
      {
        weight: 1000,
        roll1min: 33,
        roll1max: 37
      },
      {
        weight: 1000,
        roll1min: 38,
        roll1max: 42
      },
      {
        weight: 1000,
        roll1min: 43,
        roll1max: 50
      },
      {
        weight: 1000,
        roll1min: 51,
        roll1max: 55
      }
    ]
  },
  {
    id: 'Intelligence',
    name: "+# to Intelligence",
    weight: 9000,
    tags: ['Attribute'],
    tiers: [
      {
        weight: 1000,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 1000,
        roll1min: 13,
        roll1max: 17
      },
      {
        weight: 1000,
        roll1min: 18,
        roll1max: 22
      },
      {
        weight: 1000,
        roll1min: 23,
        roll1max: 27
      },
      {
        weight: 1000,
        roll1min: 28,
        roll1max: 32
      },
      {
        weight: 1000,
        roll1min: 33,
        roll1max: 37
      },
      {
        weight: 1000,
        roll1min: 38,
        roll1max: 42
      },
      {
        weight: 1000,
        roll1min: 43,
        roll1max: 50
      },
      {
        weight: 1000,
        roll1min: 51,
        roll1max: 55
      }
    ]
  },
  {
    id: 'AllAttributes',
    name: '+# to all Attributes',
    weight: 7200,
    tags: ['Attribute'],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 4
      },
      {
        weight: 800,
        roll1min: 5,
        roll1max: 8
      },
      {
        weight: 800,
        roll1min: 9,
        roll1max: 12
      },
      {
        weight: 800,
        roll1min: 13,
        roll1max: 16
      },
      {
        weight: 800,
        roll1min: 17,
        roll1max: 20
      },
      {
        weight: 800,
        roll1min: 21,
        roll1max: 24
      },
      {
        weight: 800,
        roll1min: 25,
        roll1max: 28
      },
      {
        weight: 800,
        roll1min: 29,
        roll1max: 32
      },
      {
        weight: 800,
        roll1min: 33,
        roll1max: 35
      }
    ]
  },
  {
    id: 'ItemFoundRarityIncrease',
    name: "#% increased Rarity of Items found",
    weight:4000,
    tags: [],
    tiers: [
      {
        weight: 1000,
        roll1min: 6,
        roll1max: 10
      },
      {
        weight: 1000,
        roll1min: 11,
        roll1max: 14
      },
      {
        weight: 1000,
        roll1min: 15,
        roll1max: 20
      },
      {
        weight: 1000,
        roll1min: 21,
        roll1max: 26
      }
    ]
  },
  {
    id: 'IncreasedCastSpeed',
    name: '#% increased Cast Speed',
    weight: 3200,
    tags: [
      'Caster',
      'Speed'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 5,
        roll1max: 8
      },
      {
        weight: 800,
        roll1min: 9,
        roll1max: 12
      },
      {
        weight: 800,
        roll1min: 13,
        roll1max: 16
      },
      {
        weight: 800,
        roll1min: 17,
        roll1max: 20
      }
    ]
  },
  {
    id: 'IncreasedAccuracy',
    name: '+# to Accuracy Rating',
    weight: 4600,
    tags: [
      'Attack'
    ],
    tiers: [
      {
        weight: 600,
        roll1min: 50,
        roll1max: 100
      },
      {
        weight: 1000,
        roll1min: 100,
        roll1max: 165
      },
      {
        weight: 1000,
        roll1min: 166,
        roll1max: 250
      },
      {
        weight: 1000,
        roll1min: 251,
        roll1max: 350
      },
      {
        weight: 1000,
        roll1min: 351,
        roll1max: 480
      }
    ]
  },
  {
    id: 'LifeRegeneration',
    name: 'Regenerate # Life per second',
    weight: 8000,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 1,
        roll1max: 2
      },
      {
        weight: 1000,
        roll1min: 2.1,
        roll1max: 8
      },
      {
        weight: 1000,
        roll1min: 8.1,
        roll1max: 16
      },
      {
        weight: 1000,
        roll1min: 16.1,
        roll1max: 24
      },
      {
        weight: 1000,
        roll1min: 24.1,
        roll1max: 32
      },
      {
        weight: 1000,
        roll1min: 32.1,
        roll1max: 48
      },
      {
        weight: 1000,
        roll1min: 48.1,
        roll1max: 64
      },
      {
        weight: 1000,
        roll1min: 64.1,
        roll1max: 96
      }
    ]
  },
  {
    id: 'ManaRegeneration',
    name: '#% increased Mana Regeneration Rate',
    weight: 6000,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 10,
        roll1max: 19
      },
      {
        weight: 1000,
        roll1min: 20,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 39
      },
      {
        weight: 1000,
        roll1min: 40,
        roll1max: 49
      },
      {
        weight: 1000,
        roll1min: 50,
        roll1max: 59
      },
      {
        weight: 1000,
        roll1min: 60,
        roll1max: 69
      }
    ]
  },
  {
    id: 'CriticalStrikeChanceIncrease',
    name: '#% increased Global Critical Strike Chance',
    weight: 6000,
    tags: [
      'Critical'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 10,
        roll1max: 14
      },
      {
        weight: 1000,
        roll1min: 15,
        roll1max: 19
      },
      {
        weight: 1000,
        roll1min: 20,
        roll1max: 24
      },
      {
        weight: 1000,
        roll1min: 25,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 34
      },
      {
        weight: 1000,
        roll1min: 35,
        roll1max: 38
      }
    ]
  },
  {
    id: 'FireResistance',
    name: '+#% to Fire Resistance',
    weight: 8000,
    tags: [
      'Resistance'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 6,
        roll1max: 11
      },
      {
        weight: 1000,
        roll1min: 12,
        roll1max: 17
      },
      {
        weight: 1000,
        roll1min: 18,
        roll1max: 23
      },
      {
        weight: 1000,
        roll1min: 24,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 35
      },
      {
        weight: 1000,
        roll1min: 36,
        roll1max: 41
      },
      {
        weight: 1000,
        roll1min: 42,
        roll1max: 45
      },
      {
        weight: 1000,
        roll1min: 46,
        roll1max: 48
      }
    ]
  },
  {
    id: 'ColdResistance',
    name: '+#% to Cold Resistance',
    weight: 8000,
    tags: [
      'Resistance'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 6,
        roll1max: 11
      },
      {
        weight: 1000,
        roll1min: 12,
        roll1max: 17
      },
      {
        weight: 1000,
        roll1min: 18,
        roll1max: 23
      },
      {
        weight: 1000,
        roll1min: 24,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 35
      },
      {
        weight: 1000,
        roll1min: 36,
        roll1max: 41
      },
      {
        weight: 1000,
        roll1min: 42,
        roll1max: 45
      },
      {
        weight: 1000,
        roll1min: 46,
        roll1max: 48
      }
    ]
  },
  {
    id: 'LightningResistance',
    name: '+#% to Lightning Resistance',
    weight: 8000,
    tags: [
      'Resistance'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 6,
        roll1max: 11
      },
      {
        weight: 1000,
        roll1min: 12,
        roll1max: 17
      },
      {
        weight: 1000,
        roll1min: 18,
        roll1max: 23
      },
      {
        weight: 1000,
        roll1min: 24,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 35
      },
      {
        weight: 1000,
        roll1min: 36,
        roll1max: 41
      },
      {
        weight: 1000,
        roll1min: 42,
        roll1max: 45
      },
      {
        weight: 1000,
        roll1min: 46,
        roll1max: 48
      }
    ]
  },
  {
    id: 'ChaosResistance',
    name: '+#% to Chaos Resistance',
    weight: 1500,
    tags: [
      'Resistance'
    ],
    tiers: [
      {
        weight: 250,
        roll1min: 5,
        roll1max: 10
      },
      {
        weight: 250,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 250,
        roll1min: 16,
        roll1max: 20
      },
      {
        weight: 250,
        roll1min: 21,
        roll1max: 25
      },
      {
        weight: 250,
        roll1min: 26,
        roll1max: 30
      },
      {
        weight: 250,
        roll1min: 31,
        roll1max: 35
      }
    ]
  },
  {
    id: 'AllResistances',
    name: '+#% to all Elemental Resistances',
    weight: 6000,
    tags: [
      'Resistance'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 3,
        roll1max: 5
      },
      {
        weight: 1000,
        roll1min: 6,
        roll1max: 8
      },
      {
        weight: 1000,
        roll1min: 9,
        roll1max: 11
      },
      {
        weight: 1000,
        roll1min: 12,
        roll1max: 14
      },
      {
        weight: 1000,
        roll1min: 15,
        roll1max: 16
      },
      {
        weight: 1000,
        roll1min: 17,
        roll1max: 18
      }
    ]
  },
  {
    id: 'CriticalStrikeMultiplier',
    name: '+#% to Global Critical Strike Multiplier',
    weight: 6000,
    tags: [
      'Critical'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 1000,
        roll1min: 13,
        roll1max: 19
      },
      {
        weight: 1000,
        roll1min: 20,
        roll1max: 24
      },
      {
        weight: 1000,
        roll1min: 25,
        roll1max: 29
      },
      {
        weight: 1000,
        roll1min: 30,
        roll1max: 34
      },
      {
        weight: 1000,
        roll1min: 35,
        roll1max: 38
      }
    ]
  },
  {
    id: 'LifeGainPerTarget',
    name: 'Gain # Life per Enemy Hit with Attacks',
    weight: 3000,
    tags: [
      'Life and Mana',
      'Attack'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 2,
        roll1max: 2
      },
      {
        weight: 1000,
        roll1min: 3,
        roll1max: 3
      },
      {
        weight: 1000,
        roll1min: 4,
        roll1max: 4
      }
    ]
  },
  {
    id: 'FireDamagePercentage',
    name: '#% increased Fire Damage',
    weight: 2500,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 7
      },
      {
        weight: 500,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 500,
        roll1min: 13,
        roll1max: 17
      },
      {
        weight: 500,
        roll1min: 18,
        roll1max: 22
      },
      {
        weight: 500,
        roll1min: 23,
        roll1max: 26
      }
    ]
  },
  {
    id: 'ColdDamagePercentage',
    name: '#% increased Cold Damage',
    weight: 2500,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 7
      },
      {
        weight: 500,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 500,
        roll1min: 13,
        roll1max: 17
      },
      {
        weight: 500,
        roll1min: 18,
        roll1max: 22
      },
      {
        weight: 500,
        roll1min: 23,
        roll1max: 26
      }
    ]
  },
  {
    id: 'LightningDamagePercentage',
    name: '#% increased Lightning Damage',
    weight: 2500,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 7
      },
      {
        weight: 500,
        roll1min: 8,
        roll1max: 12
      },
      {
        weight: 500,
        roll1min: 13,
        roll1max: 17
      },
      {
        weight: 500,
        roll1min: 18,
        roll1max: 22
      },
      {
        weight: 500,
        roll1min: 23,
        roll1max: 26
      }
    ]
  },
  {
    id: 'LifeGainedFromEnemyDeath',
    name: 'Gain # Life per Enemy Killed',
    weight: 3000,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 3,
        roll1max: 6
      },
      {
        weight: 1000,
        roll1min: 7,
        roll1max: 10
      },
      {
        weight: 1000,
        roll1min: 11,
        roll1max: 14
      }
    ]
  },
  {
    id: 'ManaGainedFromEnemyDeath',
    name: 'Gain # Mana per Enemy Killed',
    weight: 3000,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 1000,
        roll1min: 1,
        roll1max: 1
      },
      {
        weight: 1000,
        roll1min: 2,
        roll1max: 3
      },
      {
        weight: 1000,
        roll1min: 4,
        roll1max: 6
      }
    ]
  },
  {
    id: 'GlobalDamageOverTimeMultiplier',
    name: '+#% to Damage over Time Multiplier',
    weight: 1500,
    tags: [],
    tiers: [
      {
        weight: 300,
        roll1min: 7,
        roll1max: 11
      },
      {
        weight: 300,
        roll1min: 12,
        roll1max: 15
      },
      {
        weight: 300,
        roll1min: 16,
        roll1max: 19
      },
      {
        weight: 300,
        roll1min: 20,
        roll1max: 23
      },
      {
        weight: 300,
        roll1min: 24,
        roll1max: 26
      }
    ]
  }
]

const ShaperPrefixModFamilies: AffixFamily[] = [
  {
    id: 'ColdDamageLifeLeech',
    name: '#% of Cold Damage Leeched as Life',
    weight: 800,
    tags: [
      'Life and Mana',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'LightningDamageLifeLeech',
    name: '#% of Lightning Damage Leeched as Life',
    weight: 800,
    tags: [
      'Life and Mana',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'MovementVelocity',
    name: '#% increased Movement Speed',
    weight: 1600,
    tags: [
      'Speed'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 4,
        roll1max: 6
      },
      {
        weight: 800,
        roll1min: 7,
        roll1max: 8
      }
    ]
  },
  {
    id: 'PhysicalAddedAsCold',
    name: 'Gain #% of Physical Damage as Extra Cold Damage',
    weight: 1600,
    tags: [
      'Physical and Chaos Damage',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 8,
        roll1max: 11
      },
      {
        weight: 800,
        roll1min: 12,
        roll1max: 15
      }
    ]
  },
  {
    id: 'PhysicalAddedAsLightning',
    name: 'Gain #% of Physical Damage as Extra Lightning Damage',
    weight: 1600,
    tags: [
      'Physical and Chaos Damage',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 8,
        roll1max: 11
      },
      {
        weight: 800,
        roll1min: 12,
        roll1max: 15
      }
    ]
  },
  {
    id: 'ElementalPenetration',
    name: 'Damage Penetrates #% Elemental Resistances',
    weight: 800,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 4,
        roll1max: 7
      }
    ]
  },
  {
    id: 'DamagePer15Attributes',
    name: '1% increased Damage per 15 Dexterity',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'DamagePer15Attributes',
    name: '1% increased Damage per 15 Intelligence',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
]

const ShaperSuffixModFamilies: AffixFamily[] = [
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Determination Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Grace Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Haste Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Vitality Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Clarity Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Determination Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GlobalItemAttributeRequirements',
    name: 'Items and Gems have #% reduced Attribute Requirements',
    weight: 1600,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 5,
        roll1max: 10
      },
      {
        weight: 800,
        roll1min: 11,
        roll1max: 15
      }
    ]
  },
  {
    id: 'SpellBlockPercentage',
    name: '#% Chance to Block Spell Damage',
    weight: 1600,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 4,
        roll1max: 5
      },
      {
        weight: 800,
        roll1min: 6,
        roll1max: 7
      }
    ]
  },
  {
    id: 'PercentageAllAttributes',
    name: '#% increased Attributes',
    weight: 800,
    tags: [
      'Attribute'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 4,
        roll1max: 5
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: '#% increased Mana Reservation Efficiency of Skills',
    weight: 800,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 6,
        roll1max: 10
      }
    ]
  },
  {
    id: 'ItemFoundQuantityIncrease',
    name: '#% increased Quantity of Items found',
    weight: 1600,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 4,
        roll1max: 7
      },
      {
        weight: 800,
        roll1min: 8,
        roll1max: 10
      }
    ]
  },
  {
    id: 'PowerFrenzyOrEnduranceChargeOnKill',
    name: '#% chance to gain a Power, Frenzy or Endurance Charge on Kill',
    weight: 1600,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 3,
        roll1max: 6
      },
      {
        weight: 800,
        roll1min: 7,
        roll1max: 10
      }
    ]
  },
  {
    id: 'MaximumBlockChance',
    name: '+2% to maximum Chance to Block Attack Damage',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 2,
        roll1max: 2
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Cold Damage over Time Multiplier',
    weight: 800,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 400,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 400,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Fire Damage over Time Multiplier',
    weight: 800,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 400,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 400,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
]

const ElderPrefixModFamilies: AffixFamily[] = [
  {
    id: 'FireDamageLifeLeech',
    name: '#% of Fire Damage Leeched as Life',
    weight: 800,
    tags: [
      'Life and Mana',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'PhysicalDamageLifeLeech',
    name: '#% of Physical Damage Leeched as Life',
    weight: 800,
    tags: [
      'Life and Mana',
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'AreaOfEffect',
    name: '#% increased Area of Effect',
    weight: 1800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 7,
        roll1max: 9
      },
      {
        weight: 600,
        roll1min: 10,
        roll1max: 12
      },
      {
        weight: 400,
        roll1min: 13,
        roll1max: 15
      }
    ]
  },
  {
    id: 'Pierce',
    name: 'Projectiles Pierce an additional Target',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'PhysicalAddedAsFire',
    name: 'Gain #% of Physical Damage as Extra Fire Damage',
    weight: 1600,
    tags: [
      'Physical and Chaos Damage',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 8,
        roll1max: 11
      },
      {
        weight: 800,
        roll1min: 12,
        roll1max: 15
      }
    ]
  },
  {
    id: 'NonChaosAddedAsChaos',
    name: 'Gain #% of Non-Chaos Damage as extra Chaos Damage',
    weight: 800,
    tags: [
      'Physical and Chaos Damage',
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 3,
        roll1max: 5
      }
    ]
  },
  {
    id: 'MaximumMinionCount',
    name: '+1 to maximum number of Raised Zombies',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'MaximumMinionCount',
    name: '+1 to maximum number of Skeletons',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'MaximumLeechRate',
    name: '#% increased Maximum total Life Recovery per second from Leech',
    weight: 800,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 15,
        roll1max: 25
      }
    ]
  },
  {
    id: 'DamagePer15Attributes',
    name: '1% increased Damage per 15 Strength',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
]

const ElderSuffixModFamilies: AffixFamily[] = [
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Wrath Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Anger Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 22 Hatred Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: 'Grants Level 15 Envy Skill',
    weight: 800,
    tags: [],
    tiers: [
      {
        weight: 800,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'GrantedSkill',
    name: '#% increased Attack Speed',
    weight: 800,
    tags: [
      'Attack',
      'Speed'
    ],
    tiers: [
      {
        weight: 800,
        roll1min: 7,
        roll1max: 13
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Chaos Damage over Time Multiplier',
    weight: 800,
    tags: [
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 400,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 400,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Physical Damage over Time Multiplier',
    weight: 800,
    tags: [
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 400,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 400,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
]

const CrusaderPrefixModFamilies: AffixFamily[] = [
  {
    id: 'PhysicalAddedAsLightning',
    name: 'Gain #% of Physical Damage as Extra Lightning Damage',
    weight: 1000,
    tags: [
      'Physical and Chaos Damage',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 10
      },
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      }
    ]
  },
  {
    id: 'LightningDamageLifeLeech',
    name: '#% of Lightning Damage Leeched as Life',
    weight: 500,
    tags: [
      'Life and Mana',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'LightningDamageLifeLeech',
    name: '#% of Lightning Damage Leeched as Energy Shield',
    weight: 500,
    tags: [
      'Defense',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.2,
        roll1max: 0.4
      }
    ]
  },
  {
    id: 'DamagePer15Attributes',
    name: '1% increased Damage per 15 Intelligence',
    weight: 500,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'AllDamage',
    name: '#% increased Damage per Power Charge',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 4
      },
      {
        weight: 500,
        roll1min: 5,
        roll1max: 6
      }
    ]
  },
  {
    id: 'LightningResistancePenetration',
    name: 'Damage Penetrates #% Lightning Resistance',
    weight: 500,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 250,
        roll1min: 4,
        roll1max: 7
      },
      {
        weight: 250,
        roll1min: 8,
        roll1max: 10
      }
    ]
  },
  {
    id: 'MaximumLeechRate',
    name: '#% increased Maximum total Life Recovery per second from Leech',
    weight: 250,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 250,
        roll1min: 15,
        roll1max: 25
      }
    ]
  },
  {
    id: 'MaximumLeechRate',
    name: '#% increased Maximum total Energy Shield Recovery per second from Leech',
    weight: 500,
    tags: [
      'Defense'
    ],
    tiers: [
      {
        weight: 250,
        roll1min: 15,
        roll1max: 25
      }
    ]
  },

]

const CrusaderSuffixModFamilies: AffixFamily[] = [
  {
    id: 'PercentageIntelligence',
    name: '#% increased Intelligence',
    weight: 1000,
    tags: [
      'Attribute'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 8
      },
      {
        weight: 500,
        roll1min: 9,
        roll1max: 12
      }
    ]
  },
  {
    id: 'SpellBlockPercentage',
    name: '#% Chance to Block Spell Damage',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 4,
        roll1max: 5
      },
      {
        weight: 500,
        roll1min: 6,
        roll1max: 7
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Wrath has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 40,
        roll1max: 50
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Discipline has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 50,
        roll1max: 60
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Purity of Lightning has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 50,
        roll1max: 60
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Zealotry has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 50,
        roll1max: 60
      }
    ]
  },
  {
    id: 'MaximumBlockChance',
    name: '+2% to maximum Chance to Block Spell Damage',
    weight: 250,
    tags: [],
    tiers: [
      {
        weight: 250,
        roll1min: 2,
        roll1max: 2
      }
    ]
  },
]

const RedeemerPrefixModFamilies: AffixFamily[] = [
  {
    id: 'PhysicalAddedAsCold',
    name: 'Gain #% of Physical Damage as Extra Cold Damage',
    weight: 1000,
    tags: [
      'Physical and Chaos Damage',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 10
      },
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      }
    ]
  },
  {
    id: 'ColdDamageLifeLeech',
    name: '#% of Cold Damage Leeched as Life',
    weight: 500,
    tags: [
      'Life and Mana',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'ColdDamageLifeLeech',
    name: '#% of Cold Damage Leeched as Energy Shield',
    weight: 500,
    tags: [
      'Defense',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.2,
        roll1max: 0.4
      }
    ]
  },
  {
    id: 'DamagePer15Attributes',
    name: '1% increased Damage per 15 Dexterity',
    weight: 500,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'AllDamage',
    name: '#% increased Damage per Frenzy Charge',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 4
      },
      {
        weight: 500,
        roll1min: 5,
        roll1max: 6
      }
    ]
  },
  {
    id: 'ColdResistancePenetration',
    name: 'Damage Penetrates #% Cold Resistance',
    weight: 500,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 250,
        roll1min: 4,
        roll1max: 7
      },
      {
        weight: 250,
        roll1min: 8,
        roll1max: 10
      }
    ]
  },
]

const RedeemerSuffixModFamilies: AffixFamily[] = [
  {
    id: 'ReducedManaReservationsCost',
    name: '#% increased Mana Reservation Efficiency of Skills',
    weight: 1000,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 4,
        roll1max: 6
      },
      {
        weight: 500,
        roll1min: 7,
        roll1max: 10
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Hatred has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 40,
        roll1max: 50
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Grace has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 40,
        roll1max: 50
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Purity of Ice has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 50,
        roll1max: 60
      }
    ]
  },
  {
    id: 'PercentageDexterity',
    name: '#% increased Dexterity',
    weight: 1000,
    tags: [
      'Attribute'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 8
      },
      {
        weight: 500,
        roll1min: 9,
        roll1max: 12
      }
    ]
  },
  {
    id: 'IncreasedAilmentEffectOnEnemies',
    name: '#% increased Effect of Non-Damaging Ailments',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 15,
        roll1max: 20
      },
      {
        weight: 500,
        roll1min: 21,
        roll1max: 25
      }
    ]
  },
  {
    id: 'SpellDamageSuppressed',
    name: 'Prevent +2% of Suppressed Spell Damage',
    weight: 250,
    tags: [],
    tiers: [
      {
        weight: 250,
        roll1min: 2,
        roll1max: 2
      }
    ]
  },
  {
    id: 'WarcrySpeed',
    name: '#% increased Warcry Speed',
    weight: 1500,
    tags: [
      'Speed'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 21,
        roll1max: 25
      },
      {
        weight: 500,
        roll1min: 26,
        roll1max: 30
      },
      {
        weight: 500,
        roll1min: 31,
        roll1max: 35
      }
    ]
  },
  {
    id: 'DoubleDamage',
    name: '#% chance to deal Double Damage if you have Stunned an Enemy Recently',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 7
      },
      {
        weight: 500,
        roll1min: 8,
        roll1max: 10
      }
    ]
  },
]

const HunterPrefixModFamilies: AffixFamily[] = [
  {
    id: 'Pierce',
    name: 'Projectiles Pierce an additional Target',
    weight: 500,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'MovementVelocity',
    name: '#% increased Movement Speed',
    weight: 1000,
    tags: [
      'Speed'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 6
      },
      {
        weight: 500,
        roll1min: 7,
        roll1max: 10
      }
    ]
  },
  {
    id: 'PhysicalDamageLifeLeech',
    name: '#% of Physical Damage Leeched as Life',
    weight: 500,
    tags: [
      'Life and Mana',
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'ChaosDamageLifeLeech',
    name: '#% of Chaos Damage Leeched as Life',
    weight: 500,
    tags: [
      'Life and Mana',
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'ElementalPenetration',
    name: 'Damage Penetrates #% Elemental Resistances',
    weight: 500,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 250,
        roll1min: 3,
        roll1max: 4
      },
      {
        weight: 250,
        roll1min: 5,
        roll1max: 6
      }
    ]
  },
]

const HunterSuffixModFamilies: AffixFamily[] = [
  {
    id: 'ReducedManaReservationsCost',
    name: 'Malevolence has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 40,
        roll1max: 50
      }
    ]
  },
  {
    id: 'GlobalItemAttributeRequirements',
    name: 'Items and Gems have #% reduced Attribute Requirements',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 10
      },
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      }
    ]
  },
  {
    id: 'PowerFrenzyOrEnduranceChargeOnKill',
    name: '#% chance to gain a Power, Frenzy or Endurance Charge on Kill',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 6
      },
      {
        weight: 500,
        roll1min: 7,
        roll1max: 10
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Fire Damage over Time Multiplier',
    weight: 1000,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 500,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Cold Damage over Time Multiplier',
    weight: 1000,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 500,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Chaos Damage over Time Multiplier',
    weight: 1000,
    tags: [
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 500,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
  {
    id: 'DamageOverTimeMultiplier',
    name: '+#% to Physical Damage over Time Multiplier',
    weight: 1000,
    tags: [
      'Physical and Chaos Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      },
      {
        weight: 500,
        roll1min: 16,
        roll1max: 20
      }
    ]
  },
]

const WarlordPrefixModFamilies: AffixFamily[] = [
  {
    id: 'AreaOfEffect',
    name: '#% increased Area of Effect',
    weight: 1500,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 7,
        roll1max: 9
      },
      {
        weight: 500,
        roll1min: 10,
        roll1max: 12
      },
      {
        weight: 500,
        roll1min: 13,
        roll1max: 15
      }
    ]
  },
  {
    id: 'PhysicalAddedAsFire',
    name: 'Gain #% of Physical Damage as Extra Fire Damage',
    weight: 1000,
    tags: [
      'Physical and Chaos Damage',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 10
      },
      {
        weight: 500,
        roll1min: 11,
        roll1max: 15
      }
    ]
  },
  {
    id: 'FireDamageLifeLeech',
    name: '#% of Fire Damage Leeched as Life',
    weight: 500,
    tags: [
      'Life and Mana',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.3,
        roll1max: 0.5
      }
    ]
  },
  {
    id: 'FireDamageLifeLeech',
    name: '#% of Fire Damage Leeched as Energy Shield',
    weight: 500,
    tags: [
      'Defense',
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 0.2,
        roll1max: 0.4
      }
    ]
  },
  {
    id: 'DamagePer15Attributes',
    name: '1% increased Damage per 15 Strength',
    weight: 500,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 1,
        roll1max: 1
      }
    ]
  },
  {
    id: 'AllDamage',
    name: '#% increased Damage per Endurance Charge',
    weight: 1000,
    tags: [],
    tiers: [
      {
        weight: 500,
        roll1min: 3,
        roll1max: 4
      },
      {
        weight: 500,
        roll1min: 5,
        roll1max: 6
      }
    ]
  },
  {
    id: 'FireResistancePenetration',
    name: 'Damage Penetrates #% Fire Resistance',
    weight: 500,
    tags: [
      'Elemental Damage'
    ],
    tiers: [
      {
        weight: 250,
        roll1min: 4,
        roll1max: 7
      },
      {
        weight: 250,
        roll1min: 8,
        roll1max: 10
      }
    ]
  }
]

const WarlordSuffixModFamilies: AffixFamily[] = [
  {
    id: 'PercentageStrength',
    name: '#% increased Strength',
    weight: 1000,
    tags: [
      'Attribute'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 5,
        roll1max: 8
      },
      {
        weight: 500,
        roll1min: 9,
        roll1max: 12
      }
    ]
  },
  {
    id: 'MaximumBlockChance',
    name: '+2% to maximum Chance to Block Attack Damage',
    weight: 250,
    tags: [],
    tiers: [
      {
        weight: 250,
        roll1min: 2,
        roll1max: 2
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Anger has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 40,
        roll1max: 50
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Determination has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 40,
        roll1max: 50
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Purity of Fire has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 50,
        roll1max: 60
      }
    ]
  },
  {
    id: 'ReducedManaReservationsCost',
    name: 'Pride has #% increased Mana Reservation Efficiency',
    weight: 500,
    tags: [
      'Life and Mana'
    ],
    tiers: [
      {
        weight: 500,
        roll1min: 40,
        roll1max: 50
      }
    ]
  }
]

const influencePrefixMap: Record<Influence, AffixFamily[]> = {
  'Crusader': CrusaderPrefixModFamilies,
  'Elder': ElderPrefixModFamilies,
  'Hunter': HunterPrefixModFamilies,
  'Redeemer': RedeemerPrefixModFamilies,
  'Shaper': ShaperPrefixModFamilies,
  'Warlord': WarlordPrefixModFamilies
}

const influenceSuffixMap: Record<Influence, AffixFamily[]> = {
  'Crusader': CrusaderSuffixModFamilies,
  'Elder': ElderSuffixModFamilies,
  'Hunter': HunterSuffixModFamilies,
  'Redeemer': RedeemerSuffixModFamilies,
  'Shaper': ShaperSuffixModFamilies,
  'Warlord': WarlordSuffixModFamilies
}