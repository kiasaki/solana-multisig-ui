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
          "name": "owner",
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
