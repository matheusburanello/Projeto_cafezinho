const MENU = [ // Array principal que define o menu da aplicação
  { // Seção de bebidas
    title: "Drinks", // Título da categoria
    data: [ // Array de produtos desta categoria
      { // Primeiro produto: Expresso Cappuccino
        id: "1", // ID único do produto
        title: "Expresso Cappuccino", // Nome do produto
        description: [ // Array com descrições do produto
          "cappuccino" // Descrição simples
        ],
        cover: require("../../assets/products/cover/Coffe_1.png"), // Imagem de capa (require para assets locais)
        thumbnail: require("../../assets/products/thumbnail/Coffe1.png"), // Imagem miniatura
        description: [ // Array de ingredientes
          "Espresso","Milk","White Chocolate Syrup","Caramel Drizzle", // Lista de ingredientes
        ],
      },
      { // Segundo produto: Expresso Latte
        id: "2", // ID único do produto
        title: "Expresso Latte", // Nome do produto
        cover: require("../../assets/products/cover/Coffe_2.png"), // Imagem de capa
        thumbnail: require("../../assets/products/thumbnail/Coffe2.png"), // Imagem miniatura
        description: [ // Array de ingredientes
          "Leite vaporizado", // Primeiro ingrediente
          "Combinado com uma fina camada final de espuma de leite por cima", // Descrição do preparo
        ],
      },

      { // Terceiro produto: Expresso Americano
        id: "3", // ID único do produto
        title: "Expresso Americano", // Nome do produto
        cover: require("../../assets/products/cover/Coffe_3.png"), // Imagem de capa
        thumbnail: require("../../assets/products/thumbnail/Coffe3.png"), // Imagem miniatura
        description: [ // Array de ingredientes
          "Agua","Cafe expresso", // Ingredientes simples
        ],
      },

      { // Quarto produto: Expresso Mocha
        id: "4", // ID único do produto
        title: "Expresso Mocha", // Nome do produto
        cover: require("../../assets/products/cover/Coffe_4.png"), // Imagem de capa
        thumbnail: require("../../assets/products/thumbnail/Coffe4.png"), // Imagem miniatura
        description: [ // Array de ingredientes
          "Agua","Leite vaporizado","Caramelo"], // Lista de ingredientes
      },
    ],
  },


  //{
  //  title: "Sweets", // Categoria de doces (comentada)
  //  data: [ // Array de produtos (vazio)
  //
  //  ],
  //},

  //{
  //  title: "Savory", // Categoria de salgados (comentada)
  //  data: [ // Array de produtos (vazio)
  //
  //  ],
  //},
];

const PRODUCTS = MENU.map((item) => item.data).flat(); // Extrai todos os produtos de todas as categorias em um array único

const CATEGORIES = MENU.map((item) => item.title); // Extrai apenas os títulos das categorias

type ProductProps = (typeof PRODUCTS)[0]; // Define tipo TypeScript baseado na estrutura do primeiro produto

export { MENU, PRODUCTS, CATEGORIES, ProductProps }; // Exporta constantes e tipo para uso em outros arquivos
