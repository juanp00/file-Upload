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
const app = firebase.initializeApp(firebaseConfig);

// Obtendo referência para o Storage
const storage = firebase.storage();

// Seletor do input de arquivo no HTML (ajuste conforme necessário)
const inputFile = document.getElementById('btnSubmit');
const inputFileUrl = document.getElementById('urlFile');

inputFileUrl.addEventListener('change', function(event) {
  const selectedFile = event.target.files[0]; 
  const fileName = selectedFile.name;
  console.log(selectedFile, fileName)
  const elementFileName = document.querySelector('.fileNameText');

  elementFileName.style.display = "block";
  elementFileName.innerHTML = fileName;
});

// Evento de mudança no input de arquivo
inputFile.addEventListener('click', function(event) {
  event.preventDefault();
  handleFileUpload();
});

// Função para lidar com o upload do arquivo
function handleFileUpload() {
  const fileInput = document.getElementById('urlFile');
  console.log(fileInput.files[0])

  if(fileInput.files.length === 0) {
    alert('Nenhuma imagem selecionada.');
  }else {
    const file = fileInput.files[0];
    // Criando uma referência para o arquivo no Storage
    const storageRef = storage.ref(`imagens/${file.name}`);

    // Realizando o upload do arquivo
    const uploadTask = storageRef.put(file);

    // Monitorando o progresso do upload
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Acompanhamento do progresso (opcional)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const progressFixed = progress.toFixed(0);
        console.log(`Progresso do upload: ${progress}%`);
        
        const barProgress = document.querySelector('.progress-bar-inactive');
        const barActive = document.querySelector('.progress-bar-active');
        const textProgress = document.querySelector('.text-progress');
        const wrapperProgress = document.querySelector('.wrapper-progress');
        
        barProgress.style.display = "flex";
        wrapperProgress.style.display = "block";
        textProgress.textContent = `${progressFixed}%`;
        barActive.style.width = `${progressFixed}%`;
      },
      (error) => {
        // Tratamento de erros
        console.error('Erro no upload:', error);
      },
      () => {
        // Upload concluído com sucesso
        console.log('Upload concluído com sucesso. URL:', uploadTask.snapshot.downloadURL);
      }
    );
    
  }
}
