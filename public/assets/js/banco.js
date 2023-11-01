  import {
    initializeApp
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
  import {
    getDatabase,
    ref,
    push,
    get,
    set,
    onValue,
    remove,
    update
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged,
    reauthenticateWithCredential,
    updatePassword,
    EmailAuthProvider
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCCp8A-C7fuA6aNo0bLACty7f0pzrZTIqk",
    authDomain: "muambas-shop.firebaseapp.com",
    databaseURL: "https://muambas-shop-default-rtdb.firebaseio.com",
    projectId: "muambas-shop",
    storageBucket: "gs://muambas-shop.appspot.com",
    messagingSenderId: "647727361533",
    appId: "1:647727361533:web:2a0abff8380a614d293d94",
    measurementId: "G-1Q9Y1Y2Z53"
    
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();
  const storage = getStorage(app);
  
   //banco de dados referências
  const produtosRef = ref(database, "produtos");
  const usuariosRef = ref(database, "usuarios");
  
  
  // total clientes
  const clientesTotalP = document.querySelector(".total-clientes");
  if(clientesTotalP){
  get(usuariosRef).then((snapshot) => {
    const usuarios = snapshot.val();
    if (usuarios) {
    // Obtém a contagem de ramos dentro da branch "usuarios"
    const numeroDeRamos = Object.keys(usuarios).length;
    clientesTotalP.textContent = numeroDeRamos;
  } else {
    console.log("A branch 'usuarios' está vazia ou não existe.");
  }
  }).catch((error) => {
  console.error("Ocorreu um erro ao acessar a branch 'usuarios':", error);
});
  }
  
  // total pedidos
  const pedidosTotal = document.querySelector(".total-pedidos");
  if(pedidosTotal){
  get(usuariosRef).then((snapshot) => {
  const usuarios = snapshot.val();
  if (usuarios) {
    let totalGeralPedidos = 0;

    // Loop através de cada usuário
    for (const userId in usuarios) {
      if (usuarios.hasOwnProperty(userId)) {
        const usuario = usuarios[userId];
        
        // Verifique se o usuário tem a pasta "pedidos"
        if (usuario.hasOwnProperty("pedidos")) {
          // Obtenha o número de pedidos para este usuário
          const numeroDePedidos = Object.keys(usuario.pedidos).length;
          console.log(`Usuário ${userId} tem ${numeroDePedidos} pedidos.`);
          // Adicione o número de pedidos ao total geral
          totalGeralPedidos += numeroDePedidos;
        }
      }
    }

    console.log(`Total geral de pedidos: ${totalGeralPedidos}`);
    pedidosTotal.textContent = totalGeralPedidos;
  } else {
    console.log("A branch 'usuarios' está vazia ou não existe.");
  }
  }).catch((error) => {
  console.error("Ocorreu um erro ao acessar a branch 'usuarios':", error);
  });
  }
  
  // total contato 
  const contatoTotal = document.querySelector(".contato-total");
  if(contatoTotal) {
    
  }
  
  
  function calcularTotalPedido(pedido) {
  let total = 0;
  for (const produtoId in pedido) {
    if (pedido.hasOwnProperty(produtoId)) {
      const produto = pedido[produtoId];
      const precoUnitario = parseFloat(produto.preco_unitario);
      const quantidade = parseInt(produto.quantidade, 10);
      total += precoUnitario * quantidade;
    }
  }
  return total;
}
  function createPedidoTable() {
  const pedidoTable = document.querySelector(".tbody-pedidos");
  if (pedidoTable) {
  onValue(usuariosRef, (snapshot) => {
    const usuarios = snapshot.val();
    if (usuarios) {
      for (const userId in usuarios) {
        if (usuarios.hasOwnProperty(userId)) {
          const usuario = usuarios[userId];

          if (usuario.hasOwnProperty("pedidos")) {
            const pedidos = usuario.pedidos;

            for (const pedidoId in pedidos) {
              if (pedidos.hasOwnProperty(pedidoId)) {
                const pedido = pedidos[pedidoId];
                const credenciais = usuario.credenciais;
                const nome = credenciais.nome + " " + credenciais.sobrenome;
                const id = credenciais.id;
                const status = pedido["01_produto"].status;
                const ordemKey = pedido["01_produto"].ordemKey;
                const totalPedido = calcularTotalPedido(pedido);

                const row = createTableRowPedido(pedidoId, nome, status, ordemKey, totalPedido, id);
                pedidoTable.appendChild(row);
              }
            }
          }
        }
      }
    } else {
      console.log("A branch 'usuarios' está vazia ou não existe.");
    }
  });
}}
  function createTableRowPedido(pedidoId, nome, status, ordemkey, totalPedido, id) {
  const row = document.createElement("tr");
  const identificador = "pedido" + id + pedidoId
  row.class = "text-gray-700 dark:text-gray-400";
  row.innerHTML = `                      <td class="px-4 py-3">
                        <div class="flex items-center text-sm">
                          <!-- Avatar with inset shadow -->
                          <div
                            class="relative hidden w-8 h-8 mr-3 rounded-full md:block"
                          >
                            <img
                              class="object-cover w-full h-full rounded-full"
                              src="assets/img/Branco-logo.png"
                              alt=""
                              loading="lazy"
                            />
                            <div
                              class="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div>
                            <p class="font-semibold text-xs text-gray-600 dark:text-gray-400">${nome}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                              ${id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-sm text-xs text-gray-600 dark:text-gray-400">
                        R$ ${totalPedido}
                      </td>
                      <td class="px-4 py-3 text-xs">
                        <span
                          class="${identificador} text-xs text-gray-600 dark:text-gray-400 px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                        >
                          ${status}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm text-xs text-gray-600 dark:text-gray-400">
                        ${ordemkey}
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center space-x-4 text-sm">
                          <button
                            onclick = editarPedido("${pedidoId}","${id}")
                            class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Edit"
                          >
                            <svg
                              class="w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onclick = deletePedido("${pedidoId}","${id}")
                            class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Delete"
                          >
                            <svg
                              class="w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                  `;
  return row;
}
  createPedidoTable();
  
  
  window.deletePedido = function deletePedido(pedidoId, id) {
    
    const pedidoDeleteRef = ref(database, `usuarios/${id}_usuario/pedidos/${pedidoId}`);

    // Remove o item do banco de dados
    remove(pedidoDeleteRef)
      .then(() => {
        console.log("Item" + pedidoDeleteRef + "removido do banco de dados com sucesso!")
      })
      .catch((error) => {
        console.error("Erro ao remover o item do banco de dados:", error);
      });
  }
  
  // Função para criar o select suspenso
    window.editarPedido = function editarPedido(pedidoId, id) {
    // Crie um div para o modal
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modal");
    modalDiv.style.position = "fixed";
    modalDiv.style.top = "50%";
    modalDiv.style.left = "50%";
    modalDiv.style.transform = "translate(-50%, -50%)";
    modalDiv.style.backgroundColor = "#fff";
    modalDiv.style.border = "1px solid #ccc";
    modalDiv.style.padding = "20px";
    modalDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    modalDiv.style.zIndex = "1000";
    modalDiv.style.maxWidth = "300px";
    
    const pedidoEditRef = ref(database, `usuarios/${id}_usuario/pedidos/${pedidoId}`);

    // Crie o select
    const selectStatus = document.createElement("select");
    selectStatus.innerHTML = `
        <option value="Processando">Processando</option>
        <option value="Pendente">Pendente</option>
        <option value="Cancelado">Cancelado</option>
        <option value="Concluído">Concluído</option>
        <option value="Expirado">Expirado</option>
        <option value="Reembolso">Reembolso</option>
    `;

    selectStatus.addEventListener("change", (event) => {
        const novoStatus = event.target.value;

        atualizarStatusEmTodosProdutos(pedidoId, id, novoStatus);

        modalDiv.remove();
    });

    // Adicione o select ao modal
    modalDiv.appendChild(selectStatus);

    // Adicione o modal ao corpo do documento
    document.body.appendChild(modalDiv);
}

  // Função para atualizar o status em todas as pastas de produto dentro do pedido
   window.atualizarStatusEmTodosProdutos = function atualizarStatusEmTodosProdutos(pedidoId, id, novoStatus) {
    const pedidoRef = ref(database, `usuarios/${id}_usuario/pedidos/${pedidoId}`);
    

    get(pedidoRef).then((snapshot) => {
        const pedido = snapshot.val();

        if (pedido) {
    for (const pastaId in pedido) {
        if (pedido.hasOwnProperty(pastaId)) {
            const pastaRef = ref(database, `usuarios/${id}_usuario/pedidos/${pedidoId}/${pastaId}`);
            console.log('pastaId:', pastaId);
            console.log('pastaRef:', pastaRef);
            console.log('novoStatus:', novoStatus);

            // Atualize o status diretamente na pasta
            update(pastaRef, { status: novoStatus })
                .then(() => {
                  const element = document.querySelector(`.pedido${id}${pedidoId}`);
if (element) {
    element.textContent = novoStatus;
    console.log(`Status atualizado com sucesso para a pasta ${pastaId}`);
} else {
    console.log(`Elemento não encontrado para ${id}_${pedidoId}`);
}
                    console.log(`Status atualizado com sucesso para a pasta ${pastaId}`);
                })
                .catch((error) => {
                    console.error(`Erro ao atualizar o status para a pasta ${pastaId}:`, error);
                });
        } else {
            alert('nop');
        }
    }
}
    });
}
  
  
  
  // criar tabela de excluir produtos
  function createProductTable() {
  const productTable = document.querySelector(".tbody-delete-product"); // Substitua isso pelo seletor adequado
  if(productTable) {
  // Supondo que produtosRef seja uma referência válida para o seu banco de dados
  onValue(produtosRef, (snapshot) => {
    if (productTable) {
      productTable.innerHTML = "";

      const produtos = snapshot.val();
      for (const productId in produtos) {
        const product = produtos[productId];
        const row = createTableRow(product, productId);
        productTable.appendChild(row);
      }
    }
  });
}}
  function createTableRow(product, productId) {
  const row = document.createElement("tr");
  row.className = "text-gray-700 dark:text-gray-400";

  // Coluna 1 (Imagem)
  const cell1 = document.createElement("td");
  cell1.className = "px-4 py-3";
  const flexContainer = document.createElement("div");
  flexContainer.className = "flex items-center text-sm";

  const avatarContainer = document.createElement("div");
  avatarContainer.className = "relative hidden w-8 h-8 mr-3 rounded-full md:block";
  const avatarImage = document.createElement("img");
  avatarImage.className = "object-cover w-full h-full rounded-full";
  avatarImage.src = product.image;
  avatarImage.alt = "";
  avatarImage.loading = "lazy";

  const shadowDiv = document.createElement("div");
  shadowDiv.className = "absolute inset-0 rounded-full shadow-inner";
  shadowDiv.setAttribute("aria-hidden", "true");

  avatarContainer.appendChild(avatarImage);
  avatarContainer.appendChild(shadowDiv);
  flexContainer.appendChild(avatarContainer);

  // Limita o título a 15 caracteres
  const titleText = product.title.length > 15 ? product.title.slice(0, 15) + "..." : product.title;

  // Limita o subtítulo a 15 caracteres
  const subtitleText = product.subtitle.length > 15 ? product.subtitle.slice(0, 15) + "..." : product.subtitle;


  const textContainer = document.createElement("div");
  const title = document.createElement("p");
  title.className = "font-semibold";
  title.textContent = titleText;

  const subtitle = document.createElement("p");
  subtitle.className = "text-xs text-gray-600 dark:text-gray-400";
  subtitle.textContent = subtitleText;

  textContainer.appendChild(title);
  textContainer.appendChild(subtitle);
  flexContainer.appendChild(textContainer);
  cell1.appendChild(flexContainer);
  row.appendChild(cell1);

  // Coluna 2 (Preço)
  const cell2 = document.createElement("td");
  cell2.className = "px-4 py-3 text-sm";
  cell2.textContent = product.price;
  row.appendChild(cell2);

  // Coluna 3 (Status)
  const cell3 = document.createElement("td");
  cell3.className = "px-4 py-3 text-xs";
  const statusSpan = document.createElement("span");
  statusSpan.className = "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100";
  statusSpan.textContent = "Ativo";
  cell3.appendChild(statusSpan);
  row.appendChild(cell3);

  // Coluna 4 (Data)
  const cell4 = document.createElement("td");
  cell4.className = "px-4 py-3 text-sm";
  cell4.textContent = "0";
  row.appendChild(cell4);

  // Coluna 5 (Ações)
  const cell5 = document.createElement("td");
  cell5.className = "px-4 py-3";
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "flex items-center space-x-4 text-sm";


  // Botão de Exclusão
  
  actionsDiv.innerHTML = `<button
                            onclick="deleteProduct('${productId}')"
                            class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Delete"
                          >
                            <svg
                              class="w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </button>`;

  
  
  cell5.appendChild(actionsDiv);
  row.appendChild(cell5);
  return row;
  
  }
  createProductTable();
   window.deleteProduct = function deleteProduct(id) {
     
 const branchId = ref(database, `produtos/${id}`);


        // Remove o item do banco de dados
    remove(branchId)
      .then(() => {
        console.log("Item" + id + "removido do banco de dados com sucesso!")
      })
      .catch((error) => {
        console.error("Erro ao remover o item do banco de dados:", error);
      });
  }
  
  
  // Puxar lista de produtos do banco de dados para editar
  function createProductCards() {
  const productContainer = document.querySelector(".container-produtos");

  // Supondo que produtosRef seja uma referência válida para o seu banco de dados

  onValue(produtosRef, (snapshot) => {
    if (productContainer) {
      productContainer.innerHTML = "";

      const produtos = snapshot.val();
      for (const productId in produtos) {
        const product = produtos[productId];
        const card = createCardElement(productId, product);

        productContainer.appendChild(card);
      }
    }
  });
}
  function createCardElement(productId, product) {
  

  const colDiv = document.createElement("div");
  colDiv.className = "card bg-light-subtle mt-4 px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800";
  colDiv.setAttribute("data-product-id", productId);
  const card = document.createElement("div");
  card.className = "card-ger"
  
  

  card.innerHTML = ` <img src="${product.image}" class="card-img-top" alt="...">
    <div class="card-body">
      <div class="text-section">
        <h5 class="card-title mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300" contenteditable="false">${product.title}</h5>
        <p class="card-subtitle text-gray-600 dark:text-gray-400" contenteditable="false">${product.subtitle}</p>
      </div>
      <div class="cta-section">
        <div class=" text-price text-gray-600 dark:text-gray-400 contenteditable="false">${product.price}</div>
        <button class="btn btn-light edit-button px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">Editar</button>
        <button class="btn btn-light save-button px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" style="display: none;">Salvar</button>
      </div>
    </div>
    <div class="text-section view-all" style="display:none" id="id">
                     <label class="block text-sm">
                <span class="text-gray-700 dark:text-gray-400">Link imagem principal</span>
                <input
                  class="card-imagem block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="https://imagem..."
                  value="${product.image}"
                />
              </label>
              
               <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">Array Imagens [4]</span>
                <textarea
                  class="card-array-images block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  rows="3"
                  placeholder=""
                  
                >${product.images}</textarea>
              </label>
              
             <label class="block mt-4 text-sm">
                <span class=" text-gray-700 dark:text-gray-400">Descrição</span>
                <textarea
                  class="card-detais block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  rows="3"
                  placeholder=""
                  
                >${product.details}</textarea>
              </label>
              
<label class="block mt-4 text-sm">
  <span class="text-gray-700 dark:text-gray-400">
    Cores
  </span>
  <select
    class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-multiselect-cor focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
    multiple
  >
    <option value="red" ${product.availablecolors.includes('red') ? 'selected' : ''}>Vermelho</option>
    <option value="blue" ${product.availablecolors.includes('blue') ? 'selected' : ''}>Azul</option>
    <option value="green" ${product.availablecolors.includes('green') ? 'selected' : ''}>Verde</option>
    <option value="pink" ${product.availablecolors.includes('pink') ? 'selected' : ''}>Rosa</option>
    <option value="yellow" ${product.availablecolors.includes('yellow') ? 'selected' : ''}>Amarelo</option>
    <option value="black" ${product.availablecolors.includes('black') ? 'selected' : ''}>Preto</option>
    <option value="white" ${product.availablecolors.includes('white') ? 'selected' : ''}>Branco</option>
    <option value="orange" ${product.availablecolors.includes('orange') ? 'selected' : ''}>Laranja</option>
    <option value="purple" ${product.availablecolors.includes('purple') ? 'selected' : ''}>Roxo</option>
    <!-- Adicione opções para outras cores aqui -->
  </select>
</label>
<label class="block mt-4 text-sm">
  <span class="text-gray-700 dark:text-gray-400">
    Categoria
  </span>
  <select
    class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700  form-multiselect card-category focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
    
  >
    <option value="Seguidores" ${product.category.includes('Seguidores') ? 'selected' : ''}>Seguidores</option>
    <option value="Curtidas" ${product.category.includes('Curtidas') ? 'selected' : ''}>Curtidas</option>
    <option value="Moda" ${product.category.includes('Moda') ? 'selected' : ''}>Moda</option>
    <option value="Fones" ${product.category.includes('Fones') ? 'selected' : ''}>Fones</option>
    <option value="Carregadores" ${product.category.includes('Carregadores') ? 'selected' : ''}>Carregadores</option>
    <option value="Som" ${product.category.includes('Som') ? 'selected' : ''}>Caixas de som</option>
    <option value="Casa" ${product.category.includes('Casa') ? 'selected' : ''}>Casa</option>
    <option value="Relógios" ${product.category.includes('Relógios') ? 'selected' : ''}>Relógios</option>
    <option value="Ferramentas" ${product.category.includes('Ferramentas') ? 'selected' : ''}>Ferramentas</option>
    <option value="Seleção" ${product.category.includes('Seleção') ? 'selected' : ''}>Seleção</option>
    <!-- Adicione opções para outras categorias aqui -->
  </select>
</label>
<label class="block mt-4 text-sm">
    <span class="text-gray-700 dark:text-gray-400">
        Avaliação
    </span>
    <select class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-multiselect form-multiselect-review card-review focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
        <option value="4.1 Review" ${product.review.includes('4.1 Review') ? 'selected' : ''}>4.1</option>
        <option value="4.2 Review" ${product.review.includes('4.2 Review') ? 'selected' : ''}>4.2</option>
        <option value="4.3 Review" ${product.review.includes('4.3 Review') ? 'selected' : ''}>4.3</option>
        <option value="4.4 Review" ${product.review.includes('4.4 Review') ? 'selected' : ''}>4.4</option>
        <option value="4.5 Review" ${product.review.includes('4.5 Review') ? 'selected' : ''}>4.5</option>
        <option value="4.6 Review" ${product.review.includes('4.6 Review') ? 'selected' : ''}>4.6</option>
        <option value="4.7 Review" ${product.review.includes('4.7 Review') ? 'selected' : ''}>4.7</option>
        <option value="4.8 Review" ${product.review.includes('4.8 Review') ? 'selected' : ''}>4.8</option>
        <option value="4.9 Review" ${product.review.includes('4.9 Review') ? 'selected' : ''}>4.9</option>
        <option value="5.0 Review" ${product.review.includes('5.0 Review') ? 'selected' : ''}>5.0</option>
    </select>
</label>

 </div>
 
 `;


  colDiv.appendChild(card);

  return colDiv;
}
  function updateProduct(productId, updatedData) {
  // Verifique se a productId é válida
  if (!productId) {
    console.error("ID de produto inválido.");
    return;
  }

  // Obtenha a referência para o produto no banco de dados usando produtosRef
  const productRef = ref(database, `produtos/${productId}`);

  // Atualize apenas os campos especificados em updatedData
  update(productRef, updatedData)
    .then(() => {
      console.log(`Produto com ID ${productId} atualizado com sucesso.`);
    })
    .catch((error) => {
      console.error(`Erro ao atualizar o produto: ${error}`);
    });
}
  createProductCards();
 
 
  // Enviar um novo produto ao banco 
  const enviarBotao = document.querySelector('.enviar-new-product');
  if (enviarBotao) {
enviarBotao.addEventListener('click', () => {
  // Coletando os valores
  const newProductTitle = document.querySelector('.new-product-title').value;
  const newProductSubtitle = document.querySelector('.new-product-subtitle').value;
  const newProductPrice = document.querySelector('.new-product-price').value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const avaliacao = document.querySelector('.form-select').value;
  const selectedCategoryOption = document.querySelector('.form-multiselect-caty option:checked');
  const category = selectedCategoryOption ? selectedCategoryOption.value : ''; 
  const cores = Array.from(document.querySelectorAll('.form-multiselect')[1].options).filter(option => option.selected).map(option => option.value);
  const newProductLink = document.querySelector('.new-product-link').value;
  const newProductArrayLink = document.querySelector('.new-product-array-link').value;
  const elementsArray = newProductArrayLink.split(',').map(element => element.trim());
  const newProductDescription = document.querySelector('.new-product-description').value;

  const novoProduto = {
    title: newProductTitle,
    subtitle: newProductSubtitle,
    price: newProductPrice,
    type: tipo,
    review: avaliacao,
    category: category,
    availablecolors: cores,
    image: newProductLink,
    images: elementsArray,
    details: newProductDescription
  };

// Realizar a consulta para obter o último ID
  
  get(produtosRef).then((snapshot) => {
    const produtos = snapshot.val();
    if (produtos) {
      
      const idsProdutos = Object.keys(produtos);
      const ultimoId = idsProdutos[idsProdutos.length - 1];
      const id = parseInt(ultimoId);
      const novoId = (id + 1).toString().padStart(2, '0');
  
     // Crie uma nova referência para o novo produto com o novo ID
     const produtosRefId = ref(database, `produtos/${novoId}`);
     set(produtosRefId, novoProduto).then(() => { 
           // Limpar os campos após o envio
  document.querySelector('.new-product-title').value = '';
  document.querySelector('.new-product-subtitle').value = '';
  document.querySelector('.new-product-price').value = '';
  document.querySelector('input[name="tipo"][value="produto"]').checked = true;
  document.querySelector('.form-select').value = '';
  document.querySelectorAll('.form-multiselect option:checked').forEach(option => option.selected = false);
  document.querySelector('.new-product-link').value = '';
  document.querySelector('.new-product-array-link').value = '';
  document.querySelector('.new-product-description').value = '';
 
       alert('Produto enviado com sucesso!');
       }).catch((error) => { 
        alert('Erro ao enviar o produto:', error); 
         
       }); 
  
     } else {
      
      console.log("0")
      // Retorna 0 se não houver produtos cadastrados
    }
  });
});
};

  // lógica para permitir editar elementos dos produtos
  $(document).ready(function() {
  // Adiciona um evento de clique no botão de edição
  $(".container-produtos").on("click", ".edit-button", function() {
    // Encontra o card pai do botão (card) e habilita o modo de edição
    const card = $(this).closest(".card");
    enableEditMode(card);
  });

 // Adiciona um evento de clique no botão de salvar
  $(".container-produtos").on("click", ".save-button", function() {
    // Encontra o card pai do botão (card) e desabilita o modo de edição
    const card = $(this).closest(".card");
    disableEditMode(card);

    // Captura os novos valores dos elementos editáveis
    const newTitle = card.find(".card-title").text();
    const newSubtitle = card.find(".card-subtitle").text();
    const newPrice = card.find(".text-price").text();
    const newDetails = card.find(".card-detais").val();
    const newImagem = card.find(".card-imagem").val();
    
    const newArrayImages = card.find(".card-array-images").val();
    const newImages = newArrayImages.split(',').map(element => element.trim());
   
    const newCategoryOption = card.find('.card-category option:checked');
    const newCategory = newCategoryOption ? newCategoryOption.val(): ''; 
   
    const newCores = card.find('.form-multiselect-cor option:selected').map(function() {
    return $(this).val();
}).get();
 
    const newAvaliacaoOption = card.find('.form-multiselect-review option:checked');
    const newAvaliacao = newAvaliacaoOption ? newAvaliacaoOption.val(): ''; 
   
    // Obtém o ID do produto do atributo 'data-product-id'
    const productId = card.attr("data-product-id");

    // Aqui você pode enviar os novos valores para o banco de dados
    // Por exemplo, supondo que você tenha uma função chamada 'updateProduct'
    // que atualize os dados do produto no banco de dados:
    updateProduct(productId, { title: newTitle, subtitle: newSubtitle, price: newPrice, category: newCategory, details: newDetails, images: newImages, image: newImagem, availablecolors: newCores, review: newAvaliacao });
 });



  function enableEditMode(card) {
    // Habilita o modo de edição para os elementos de texto do card específico
    card.find(".text-section h5, .text-section p, .text-price").attr("contenteditable", "true");
    // Troca a classe dos botões para mostrar o botão de salvar apenas no card específico
    card.find(".edit-button").hide();
    card.find(".save-button").show();
    // Exibe a div view-all apenas no card específico
    card.find(".view-all").show();
  }

  function disableEditMode(card) {
    // Desabilita o modo de edição para os elementos de texto do card específico
    card.find(".text-section h5, .text-section p, .text-price").attr("contenteditable", "false");
    // Troca a classe dos botões para mostrar o botão de editar apenas no card específico
    card.find(".save-button").hide();
    card.find(".edit-button").show();
    // Esconde a div view-all apenas no card específico
    card.find(".view-all").hide();
  }
});


