// Configuração do Firebase
const firebaseConfig = {
apiKey: "AIzaSyC_LXsIwc4kGUTxvUK9SdJLxikxGPhe0WA",
authDomain: "file-upload-71903.firebaseapp.com",
projectId: "file-upload-71903",
storageBucket: "file-upload-71903.appspot.com",
messagingSenderId: "779828208617",
appId: "1:779828208617:web:5ae19c466b51655b262178"
};

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);

async function carregarImagensDoFirebase() {
    const divRow = document.querySelector('.row-gallery');
  
    const pathToImages = 'imagens'; // caminho dentro do bucket storage
    const storageRef = firebase.storage().ref().child(pathToImages);
  
    try {
      const result = await storageRef.listAll();
  
      for (const imageRef of result.items) {
        try {
          const url = await imageRef.getDownloadURL();
          
          const sizeImg = document.querySelector('.size-img');
          const typeImg = document.querySelector('.type-img');
          const divImg = document.createElement('div');
          const img = document.createElement('img');
          divImg.classList.add('col-md-3', 'gap-3', 'divImg');
  
          img.classList.add('img-gallery');
          img.setAttribute('loading', 'lazy')
          img.src = url;
          img.style.cursor = "pointer";
          img.style.transform = "translateY(5px)";

          // Adiciona efeito de hover
          img.addEventListener('mouseleave', () => {
            img.style.transform = 'translateY(-5px)'; // Remove a transformação quando o mouse sai da imagem
          });
  
          // Adiciona o evento de clique ao elemento img
          img.addEventListener('click', function(event) {
            const clickedURL = event.target.src;

            // Cria um novo objeto de imagem
            const image = new Image();

            // Define uma função a ser executada quando a imagem é carregada
            image.onload = function() {
              // Obtém o tamanho da imagem em bytes
              const imageSizeInBytes = this.naturalWidth * this.naturalHeight * 4; // Multiplica a largura pela altura e pelo número de bytes por pixel (estimativa)
              
              // Converte o tamanho para kilobytes (KB) ou megabytes (MB)
              let imageSize;
              if (imageSizeInBytes < 1024) {
                imageSize = imageSizeInBytes + ' bytes';
              } else if (imageSizeInBytes < 1024 * 1024) {
                imageSize = (imageSizeInBytes / 1024).toFixed(2) + ' KB';
              } else {
                imageSize = (imageSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
              }

              // Obtém o tipo de arquivo da imagem a partir da URL
              const imageType = (clickedURL.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1]?.toUpperCase() || 'Tipo de arquivo desconhecido';
              
              // Exibe as informações da imagem no console
              console.log('Tamanho da imagem:', imageSize);
              console.log('Tipo de arquivo:', imageType);

              // Chama a função para exibir a imagem em um popup
              popupImg(clickedURL, imageSize, imageType);
            };

            // Define o src da imagem para iniciar o carregamento
            image.src = clickedURL;
          });


          divImg.appendChild(img);
          divRow.appendChild(divImg);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
}
  
function popupImg(url, size, type) {
    const section = document.querySelector('.popup-img');
    const sizeImg = document.querySelector('.size-img');
    const typeImg = document.querySelector('.type-img');
    const img = document.querySelector('.current-img');
    section.style.display = "flex";
    section.style.flexDirection = "column";
    section.style.justifyContent = "center";
    section.style.transition = "0.5s ease";
    img.src = url;
    sizeImg.innerHTML = size;
    typeImg.innerHTML = type;

    const downloadButton = document.getElementById('download-img');
    
      if (downloadButton) {
        downloadButton.addEventListener('click', function() {
          const imageUrl = url; // Substitua pelo URL da imagem no Firebase Storage
    
          // Criar um link temporário para iniciar o download
          const downloadLink = document.createElement('a');
          downloadLink.href = imageUrl;
          downloadLink.setAttribute('download', 'nome_da_imagem'); // Substitua 'nome_da_imagem' pelo nome desejado para o arquivo
          downloadLink.setAttribute('target', '_blank');
    
          // Adicionar o link ao corpo do documento, simular o clique e remover o link
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        });
      } else {
        console.error('Elemento com ID "downloadButton" não encontrado');
      }
    
}

//Evento de fechar popup
document.addEventListener('DOMContentLoaded', function() {
    const iconClose = document.querySelector('.icon-close'); // Use '.' para selecionar pela classe
    const section = document.querySelector('.popup-img');
    iconClose.addEventListener('click', function() {
      section.style.display = "none";
    });
  });
  



carregarImagensDoFirebase();

