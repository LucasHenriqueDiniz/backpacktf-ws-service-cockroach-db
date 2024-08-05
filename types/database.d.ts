// datasource db {
//     provider = "cockroachdb"
//     url      = env("DATABASE_URL")
//   }

//   generator client {
//     provider = "prisma-client-js"
//   }

//   // Criar a tabela de items no CockroachDB
//   //          # ID                  # Identificador único do item                                      # PRIMARY KEY
//   //          # NAME                # Nome do item                                                     # STRING
//   model Item {
//       id        BigInt      @id @default(autoincrement())
//       name      String
//       Listing Listing[]
//   }

//   // Criar a tabela de listings no CockroachDB
//   //         # ID                       # Identificador único do item                                      # PRIMARY KEY
//   //         # steamid                  # é o id da steam do usuário que está vendendo o item              # FOREIGN KEY
//   //         # currencies               # é UM OBjETO com o valor do item {metal: 9.33, keys: 2}           # OBJECT
//   //         # trade_offers_preferred   # é um booleano que indica se o usuário prefere trade offers       # BOOLEAN
//   //         # buy_out_only             # é um booleano que indica se o usuário só aceita buy outs         # BOOLEAN
//   //         # listed_at                # é a data e hora que o item foi listado                           # NUMBER
//   //         # bumped_at                # é a data e hora que o item foi bumpado                           # NUMBER
//   //         # intent                   # é o tipo de transação que o item está sendo vendido (buy, sell)  # STRING
//   //         # user_agent               # client (nome) lastPulse: num                                     # OBJETO
//   //         # only_buyout              # é um booleano que indica se o usuário só aceita buy outs         # BOOLEAN
//   //         # item_id                  # é o id do item que está sendo vendido                            # FOREIGN KEY

//   model Listing {
//       id                      Int       @id @default(sequence())
//       steamid                 String
//       currencies              Json
//       trade_offers_preferred  Boolean
//       buy_out_only            Boolean
//       listed_at               DateTime
//       bumped_at               DateTime
//       intent                  String
//       user_agent              Json
//       only_buyout             Boolean
//       item_id                 BigInt    // Foreign key referencing Item.id
//       item                    Item      @relation(fields: [item_id], references: [id])
//   }

interface UserAgent {
  steamid: string;
}

interface Currency {
  metal?: number;
  keys?: number;
  buds?: number;
  usd?: number;
}

interface Item {
  id?: bigint;
  name: string;
}

interface Listing {
  id?: number;
  steamid: string;
  currencies: Currency;
  trade_offers_preferred: boolean;
  buy_out_only: boolean;
  listed_at: number;
  bumped_at: number;
  intent: string;
  user_agent: UserAgent;
  only_buyout: boolean;
  item_id?: bigint;
}

export { UserAgent, Currency, Item, Listing };
