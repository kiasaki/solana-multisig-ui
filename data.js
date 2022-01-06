import * as anchor from '@project-serum/anchor';
const PublicKey = anchor.web3.PublicKey;

export const systemProgramId = anchor.web3.SystemProgram.programId;
export const tokenProgramId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const associatedTokenProgramId = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const programId = new PublicKey('2xHZtYYRzAZZfbfjzJ86UP1Go9qLRwgAZMgVJ7vEqLLM');

export const IDL = {
  "version": "0.1.0",
  "name": "multisig",
  "instructions": [
    {
      "name": "createMultisig",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "base",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "threshold",
          "type": "u64"
        },
        {
          "name": "delay",
          "type": "i64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "setOwners",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "changeThreshold",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "changeDelay",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "delay",
          "type": "i64"
        }
      ]
    },
    {
      "name": "createTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "instructions",
          "type": {
            "vec": {
              "defined": "TransactionInstruction"
            }
          }
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "approve",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "executeTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Multisig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "base",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "threshold",
            "type": "u64"
          },
          {
            "name": "delay",
            "type": "i64"
          },
          {
            "name": "gracePeriod",
            "type": "i64"
          },
          {
            "name": "numTransactions",
            "type": "u64"
          },
          {
            "name": "ownersSeqNo",
            "type": "u64"
          },
          {
            "name": "owners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "multisig",
            "type": "publicKey"
          },
          {
            "name": "index",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "eta",
            "type": "i64"
          },
          {
            "name": "ownersSeqNo",
            "type": "u64"
          },
          {
            "name": "proposer",
            "type": "publicKey"
          },
          {
            "name": "instructions",
            "type": {
              "vec": {
                "defined": "TransactionInstruction"
              }
            }
          },
          {
            "name": "signers",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "executor",
            "type": "publicKey"
          },
          {
            "name": "executedAt",
            "type": "i64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TransactionInstruction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "keys",
            "type": {
              "vec": {
                "defined": "TransactionInstructionMeta"
              }
            }
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "TransactionInstructionMeta",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidOwner",
      "msg": "The given owner is not part of this multisig."
    },
    {
      "code": 6001,
      "name": "NotEnoughSigners",
      "msg": "Not enough owners signed this transaction."
    },
    {
      "code": 6002,
      "name": "TransactionAlreadySigned",
      "msg": "Cannot delete a transaction that has been signed by an owner."
    },
    {
      "code": 6003,
      "name": "Overflow",
      "msg": "Overflow when adding."
    },
    {
      "code": 6004,
      "name": "UnableToDelete",
      "msg": "Cannot delete a transaction the owner did not create."
    },
    {
      "code": 6005,
      "name": "AlreadyExecuted",
      "msg": "The given transaction has already been executed."
    },
    {
      "code": 6006,
      "name": "InvalidThreshold",
      "msg": "Threshold must be less than or equal to the number of owners."
    },
    {
      "code": 6007,
      "name": "InvalidDelay",
      "msg": "Delay must be less than 30 days."
    },
    {
      "code": 6008,
      "name": "OwnersChanged",
      "msg": "Owners changed."
    },
    {
      "code": 6009,
      "name": "BeforeETA",
      "msg": "Before transation ETA."
    },
    {
      "code": 6010,
      "name": "UniqueOwners",
      "msg": "Unique Owners."
    }
  ]
}

export const knownIdls = {
  '2xHZtYYRzAZZfbfjzJ86UP1Go9qLRwgAZMgVJ7vEqLLM': IDL,
  'DvyFZB7C33t8WR1amZZ62t3oj3kscb9PrPAu2T1ba9dp': {
    "instructions": [
      {
        "name": "treasurySetAuthorities",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "dao",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "policyAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "treasuryTransactionAuthority",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "treasuryConfigure",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "reserveLpBond",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "treasuryConfigureStaking",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "period",
            "type": "u64"
          },
          {
            "name": "rate",
            "type": "u64"
          },
          {
            "name": "target",
            "type": "u64"
          }
        ]
      },
      {
        "name": "treasuryConfigureSale",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "merkleRootStr1",
            "type": "string"
          },
          {
            "name": "merkleRootStr2",
            "type": "string"
          },
          {
            "name": "merkleRootStr3",
            "type": "string"
          },
          {
            "name": "merkleRootStr4",
            "type": "string"
          },
          {
            "name": "merkleRootStr5",
            "type": "string"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "bondWhitelistEnd",
            "type": "u64"
          }
        ]
      },
      {
        "name": "treasuryTransaction",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "treasuryTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "receiverTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "userInitialize",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "bondInitialize",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "payer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "bond",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintBond",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintReserve",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenPrice",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenLpOther",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenLpReserve",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenReservePayout",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "bcv",
            "type": "u64"
          },
          {
            "name": "isNonStable",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenReservePayoutBump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "bondConfigure",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "bond",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "canInstant",
            "type": "bool"
          },
          {
            "name": "vestingPeriod",
            "type": "u64"
          },
          {
            "name": "minPrice",
            "type": "u64"
          },
          {
            "name": "maxPayout",
            "type": "u64"
          },
          {
            "name": "maxDebt",
            "type": "u64"
          },
          {
            "name": "discount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "bondAdjust",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "bond",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "rate",
            "type": "u64"
          },
          {
            "name": "target",
            "type": "u64"
          }
        ]
      },
      {
        "name": "bondDeposit",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "bond",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "reserveLpBond",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintBond",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintReserve",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenPriceOracle",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenOtherBondLp",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenReserveBondLp",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenOtherBondReserveLp",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenReserveBondReserveLp",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenBondUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenBondTreasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenReserveDao",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenReservePayout",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "maxPrice",
            "type": "u64"
          }
        ]
      },
      {
        "name": "bondWithdraw",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "bond",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintReserve",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenReservePayout",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenReserveUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "index",
            "type": "u64"
          }
        ]
      },
      {
        "name": "stakingDeposit",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintReserve",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintStaking",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenReserveUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenReserveStaking",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenStakingUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "stakingWithdraw",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintReserve",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintStaking",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenReserveUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenReserveStaking",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenStakingUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenStakingTmp",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Treasury",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "mintReserve",
              "type": "publicKey"
            },
            {
              "name": "mintStaking",
              "type": "publicKey"
            },
            {
              "name": "tokenReserveStaking",
              "type": "publicKey"
            },
            {
              "name": "tokenStakingTmp",
              "type": "publicKey"
            },
            {
              "name": "dao",
              "type": "publicKey"
            },
            {
              "name": "reserveLpBond",
              "type": "publicKey"
            },
            {
              "name": "tokenExcesses",
              "type": "u64"
            },
            {
              "name": "policyAuthority",
              "type": "publicKey"
            },
            {
              "name": "treasuryTransactionAuthority",
              "type": "publicKey"
            },
            {
              "name": "totalReserves",
              "type": "u64"
            },
            {
              "name": "totalDebt",
              "type": "u64"
            },
            {
              "name": "totalUsers",
              "type": "u64"
            },
            {
              "name": "stakingRate",
              "type": "u64"
            },
            {
              "name": "stakingLast",
              "type": "u64"
            },
            {
              "name": "stakingPeriod",
              "type": "u64"
            },
            {
              "name": "stakingAdjustRate",
              "type": "u64"
            },
            {
              "name": "stakingAdjustLast",
              "type": "u64"
            },
            {
              "name": "stakingAdjustTarget",
              "type": "u64"
            },
            {
              "name": "saleMerkleRoot",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "saleStart",
              "type": "u64"
            },
            {
              "name": "saleDuration",
              "type": "u64"
            },
            {
              "name": "salePrice",
              "type": "u64"
            },
            {
              "name": "bondMerkleRoot",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "bondWhitelistEnd",
              "type": "u64"
            },
            {
              "name": "teamTokenMint",
              "type": "publicKey"
            },
            {
              "name": "advisorTokenMint",
              "type": "publicKey"
            },
            {
              "name": "teamAndAdvisorTokenRedeemable",
              "type": "bool"
            },
            {
              "name": "saleMerkleRoot1",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "saleMerkleRoot2",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "saleMerkleRoot3",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "saleMerkleRoot4",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "saleMerkleRoot5",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "reserved",
              "type": {
                "array": [
                  "u8",
                  96
                ]
              }
            }
          ]
        }
      },
      {
        "name": "Bond",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "name",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "isNonStable",
              "type": "bool"
            },
            {
              "name": "tokenMint",
              "type": "publicKey"
            },
            {
              "name": "tokenPrice",
              "type": "publicKey"
            },
            {
              "name": "tokenLpOther",
              "type": "publicKey"
            },
            {
              "name": "tokenLpReserve",
              "type": "publicKey"
            },
            {
              "name": "tokenDecimals",
              "type": "u8"
            },
            {
              "name": "tokenReservePayout",
              "type": "publicKey"
            },
            {
              "name": "discount",
              "type": "u64"
            },
            {
              "name": "canInstant",
              "type": "bool"
            },
            {
              "name": "vestingPeriod",
              "type": "u64"
            },
            {
              "name": "minPrice",
              "type": "u64"
            },
            {
              "name": "maxPayout",
              "type": "u64"
            },
            {
              "name": "maxDebt",
              "type": "u64"
            },
            {
              "name": "adjustRate",
              "type": "u64"
            },
            {
              "name": "adjustLast",
              "type": "u64"
            },
            {
              "name": "adjustTarget",
              "type": "u64"
            },
            {
              "name": "isSoldOut",
              "type": "bool"
            },
            {
              "name": "bcv",
              "type": "u64"
            },
            {
              "name": "totalDebt",
              "type": "u64"
            },
            {
              "name": "totalDebtLast",
              "type": "u64"
            },
            {
              "name": "totalDebtAlltime",
              "type": "u64"
            },
            {
              "name": "totalAmount",
              "type": "u64"
            },
            {
              "name": "reserved",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "User",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "signer",
              "type": "publicKey"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "stake",
              "type": "u64"
            },
            {
              "name": "stakeTime",
              "type": "u64"
            },
            {
              "name": "stakeNextTime",
              "type": "u64"
            },
            {
              "name": "bonds",
              "type": {
                "array": [
                  {
                    "defined": "UserBond"
                  },
                  10
                ]
              }
            },
            {
              "name": "reserved",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "UserBond",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bond",
              "type": "publicKey"
            },
            {
              "name": "price",
              "type": "u64"
            },
            {
              "name": "payout",
              "type": "u64"
            },
            {
              "name": "vestingStart",
              "type": "u64"
            },
            {
              "name": "vestingPeriod",
              "type": "u64"
            },
            {
              "name": "reserved",
              "type": {
                "array": [
                  "u64",
                  2
                ]
              }
            }
          ]
        }
      }
    ],
    "events": [],
    "errors": []
  }
}
