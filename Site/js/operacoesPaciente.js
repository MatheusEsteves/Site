(function(){

// Inicia um módulo para uma aplicação Angular e utiliza as configurações
// do ngStorage (entre colchetes), o qual será responsável pela existência
// da variável de sessão SessionStorage.
var app = angular.module("operacoesPaciente",["ngStorage"]);

//Controller para a realização da conexão com o banco de dados remoto do PIVOTAL,
//através do método conectarBd do Web Service de pacientes, também no PITOVAL.
app.controller("ConexaoBdController",function($http,$scope){
   this.conectarBd = function(){
	 // Se a conexão for realizada, isConectado = true, caso contrário, isConectado = false.
	 $http.get("http://wspaciente.cfapps.io/conectarBd").
	   success(function(data){
		 $scope.isConectado = data;
	   });
   };
});

//Controller para a realização do login de paciente.
app.controller("LoginPacienteController",function($http,$scope,$sessionStorage){
   // Objeto com os dados necessários para a realização do login de paciente. Ao preencher esses
   // dados no formulário de login, os atributos do objeto serão atualizados automaticamente.
   this.paciente = {
     cpf:"",
     senha:""
   };
    
   $sessionStorage.paciente = {
     id             : 1,
     bairro         : "Jardim Nossa Senhora de Fátima",
     celular        : "19221190331",
     complemento    : "Ao lado do número 719",   
     cpf            : "47065455874",
     nome           : "Matheus Esteves Zanoto",
     senha          : "Matheus1998@",
     endereco       : "Rua Cícero Ramos Meira, 46",
     telefone       : "1921190331",
     cidade         : "Hortolândia",
     uf             : "SP",
     dataNascimento : "27/11/1998"
   };
  
   // Método para a realização do login do paciente.
   this.loginPaciente = function(){
	 /*var paciente = {
	   cpf:"",
	   senha:""
	 };
	 var cpf = this.paciente.cpf;
	 // O cpf contém ponto (.) e traço (-) no formulário de login. É necessário retirá-los
	 // para enviar ao parâmetro do método loginPaciente.
	 paciente.cpf   = cpf.replace(".","").replace(".","").replace("-","");
	 paciente.senha = this.paciente.senha;
	 
	 // Método que verifica se existe paciente cadastrado com esse cpf e essa senha. Caso exista,
	 // seus dados serão armazenados em um objeto de Paciente no próprio web service de pacientes.
     $http.post("http://wspaciente.cfapps.io/loginPaciente",paciente).success(function(data){
	     $scope.isPacienteExistente = data;
	     if ($scope.isPacienteExistente){
	       // Retorna o paciente logado e armazena seus dados na variável de sessão $sessionStorage.
	       $http.get("http://wspaciente.cfapps.io/getPaciente").success(function(data){
	    	 data.senha = "";
	         $sessionStorage.paciente = data;
	         // Posteriormente, pesquisaremos todas os hospitais cadastrados no sistema. Como esses hospitais
	    	 // não sofrerão de atualizações constantes no banco de dados, pesquisados elas apenas uma vez como
	    	 // forma de economizarmos tempo de execução. Pesquisamos apenas quando o usuário passa da tela 
	    	 // de login para a tela de exibição de hospitais. Após isso, os hospitais estarão armazenadas na 
	    	 // variável de sessão $sessionStorage. Caso o usuário esteja na página de exibição de hospitais,
	    	 // mude para outra página e depois volte para a página de exibição de hospitais, por exemplo, os 
	    	 // hospitais não serão pesquisados novamente no banco de dados, mas sim obtidos do $sessionStorage.
	         $sessionStorage.isHospitalJaPesquisado = false;
	         window.location.href = "homePaciente.html";
	       }).error(function(data){
	    	 console.log(data); 
	       });
	     }
	     else
	     // Caso não exista paciente com esse cpf e senha, a mensagem abaixo é exibida.
	       bootbox.dialog({
	    	 message:"O CPF e a senha que você digitou não coincidem.",
	    	 buttons:{ok:{label:"Voltar",class:"btn-primary"}}
	       });
	 });*/
     window.location.href = "homePaciente.html";
   };
});

//Após verificarmos que existe um paciente com o CPF e a senha digitados no login, iremos para a HOME do paciente,
//que é um local onde ele poderá visualizar os seus dados e escolher uma hospital dentre todas as hospitais que 
//serão exibidos no mapa.
app.controller("HomePacienteController",function($http,$scope,$sessionStorage){
  // Obtem os dados do paciente logado da variável de sessão $sessionStorage.
  $sessionStorage.latReferencia = -22.9464238;
  $sessionStorage.lonReferencia = -46.5264253;
  $scope.paciente = $sessionStorage.paciente;	
    
  var clinicas = [
        {   
          id        : 1,
          bairro    : "Jardim Guanabara",
          endereco  : "Rua Eduardo Lane, 200",
          nome      : "Clínica Lane",
          telefone  : "1932020155",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.8869532,
          longitude : -47.1007114
        },
        {
          id        : 2,
          bairro    : "Vila Itapura",
          endereco  : "Rua Sacramento, 900",
          nome      : "Centro Clínico Sacramento",
          telefone  : "1932325097",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.8961645,
          longitude : -47.0640828
        },
        {
          id        : 3,
          bairro    : "Cambuí",
          endereco  : "Rua Doutor Sampaio Peixoto, 206",
          nome      : "Murgel Odontologia",
          telefone  : "1921190331",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.8897432,
          longitude : -47.0529384
        }
      ];
    
  var prontoSocorros = [
         {   
          id        : 1,
          bairro    : "Centro",
          endereco  : "Avenida Andrade Neves, 402",
          nome      : "Vera Cruz",
          telefone  : "1937343091",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.879046,
          longitude : -47.061822
        },
        {   
          id        : 2,
          bairro    : "Centro",
          endereco  : "Av. Pref. Faria Lima, 340",
          nome      : "Hospital Municipal Dr.Mario Gatti",
          telefone  : "1937725700",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.9160971,
          longitude : -47.0707458
        },
        {   
          id        : 3,
          bairro    : "Jardim Alto Belém",
          endereco  : "Rua Dirce De Oliveira Santos, 280",
          nome      : "Campo Grande",
          telefone  : "1932218436",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.9511469,
          longitude : -47.1899432
        }
      ];
  
  // Método que será utilizado posteriormente para obter um objeto de uma clínica com base em seu nome,
  // dentre todas as clínicas armazenadas no vetor.
  $scope.getClinica = function(nome){
	for (i = 0 ; i < clinicas.length; i++)
      if (clinicas[i].nome == nome)
        return clinicas[i];
  };
  
  // Método que será utilizado posteriormente para obter um objeto de um pronto socorro com base em seu nome,
  // dentre todos os pronto socorros armazenados no vetor.
  $scope.getPs = function(nome){
	for (i = 0 ; i < prontoSocorros.length; i++)
	  if (prontoSocorros[i].nome == nome)
	    return prontoSocorros[i];
  };
  
  // Em alguns casos, pesquisaremos hospitais no mapa com base no seu nome, em alguma especialidade
  // médica ou até mesmo por convênio. Será retornada uma lista com os hospitais que atendem os
  // requisitos pesquisados. O método abaixo será responsável por centralizar o mapa na localização
  // do hospital mais próximo ao paciente, dentre todos os hospitais da determinada lista retornada da pesquisa.
  // Como a web service de pacientes sempre retorna seus hospitais ordenados com base na distância do paciente
  // até o hospital (da menor para a maior),o hospital com menor distância será o primeiro da lista.
  $scope.centralizarLocal = function(locais){
	var localMaisProximo = locais[0];
	var latitude = localMaisProximo.latitude;
	var longitude = localMaisProximo.longitude;
    $scope.map.setZoom(20);
    $scope.map.setCenter(new google.maps.LatLng(latitude,longitude));
  };
  
  // Quando vemos o mapa pela primeira vez, a sua centralização está na localização do paciente. Quando 
  // pesquisamos algum hospital, essa centralização muda. O método abaixo faz retornar a centralização
  // do mapa para a original (localização do paciente).
  $scope.voltarLocalizacao = function(){
    $scope.map.setZoom(16);
    $scope.map.setCenter(new google.maps.LatLng($sessionStorage.latReferencia,$sessionStorage.lonReferencia));
  };
  
  // Método que pesquisa todos os hospitais que possuem parte do seu nome igual ao texto digitado
  // no campo txtNome e centraliza o mapa no hospital mais próximo ao paciente.
  $scope.pesquisarInstituicaoPorNome = function(){
    var nome = $("#txtNome").val();
    // Primeiro buscamos as clínicas.
    $http.get("http://wspaciente.cfapps.io/getClinicasPorNome/"+
    		   nome+"/"+$sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
      if (data.length == 0)
    	// Depois buscamos os pronto socorros.
        $http.get("http://wspaciente.cfapps.io/getProntoSocorrosPorNome/"+
       		      nome+"/"+$sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
       	  if (data.length != 0)
       	    $scope.centralizarLocal(data);
        });
      else
        $scope.centralizarLocal(data);
    });
  };
  
  // Método que pesquisa todos os hospitais que trabalham com uma determinada especialidade médica, cuja parte do nome
  // seja igual ao texto digitado no campo txtEspecialidade e centraliza no mapa o hospital mais próximo ao paciente.
  $scope.pesquisarInstituicaoPorEspecialidade = function(){
    var especialidade = $("#txtEspecialidade").val();
    // Primeiro buscamos as clínicas.
	$http.get("http://wspaciente.cfapps.io/getClinicasPorEspecialidade/"+
	    	  especialidade+"/"+$sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
	  if (data.length == 0)
		// Depois buscamos os pronto socorros.
	    $http.get("http://wspaciente.cfapps.io/getProntoSocorrosPorEspecialidade/"+
	       		  especialidade+"/"+$sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
	      if (data.length != 0)
	        $scope.centralizarLocal(data);
	    });
	  else
	    $scope.centralizarLocal(data);
    });
  };
  
  // Método que pesquisa todos os hospitais que possuem um determinado convênio, cuja parte do nome seja 
  // igual ao texto digitado no campo txtConvenio e centraliza no mapa o hospital mais próximo ao paciente.
  $scope.pesquisarInstituicaoPorConvenio = function(){
    var convenio = $("#txtConvenio").val();
    // Primeiro buscamos as clínicas.
    $http.get("http://wspaciente.cfapps.io/getClinicasPorConvenio/"+
		      convenio+"/"+$sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
      if (data.length == 0)
    	// Depois buscamos os pronto socorros.
	    $http.get("http://wspaciente.cfapps.io/getProntoSocorrosPorConvenio/"+
		       	  convenio+"/"+$sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
		  if (data.length != 0)
		    $scope.centralizarLocal(data);
		});
      else
	    $scope.centralizarLocal(data);
	});
  };
  
  // Inicializa a exibição do mapa com base nos dados dos hospitais buscados do banco de dados.
  $scope.inicializarMapa = function(){
    var mapProp = {
	    center:new google.maps.LatLng($sessionStorage.latReferencia,$sessionStorage.lonReferencia),
		zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP	  
	  };     
         
   // Cria o mapa do google maps com base na configuração criada anteriormente e no local onde
  // ele será exibido (mapaHospitais).
	 $scope.map = new google.maps.Map(document.getElementById("mapaHospitais"),mapProp);	
	// Busca a geolocalização do usuário deste computador no site ipinfo. Os dados são retornados 
	// no formato json.
	/*$http.get("http://ipinfo.io/json").success(function(data){
	  var loc = data.loc;
	  var posVirgula = loc.indexOf(',');
	  // Obtem a latitude e a longitude do usuário deste computador dos dados retornados anteriormente.
	  $sessionStorage.latReferencia = parseFloat(loc.slice(0,posVirgula-1));
	  $sessionStorage.lonReferencia = parseFloat(loc.slice(posVirgula+1,loc.length-1));
	  // Cria a configuração do mapa, cuja centralização está na localização do usuário (latitude e longitude).        
        
	  // Caso já tenhamos pesquisado os hospitais no banco de dados, não pesquisaremos novamente ao entrar
	  // nessa página, mas sim obteremos eles da variável de sessão $sessionStorage.
	  if ($sessionStorage.isHospitalJaPesquisado){
	    $scope.clinicas = $sessionStorage.clinicas;
		$scope.prontoSocorros = $sessionStorage.prontoSocorros;
	  }
	  else{ 
		// Caso ainda não tenhamos pesquisado os hospitais no banco de dados (primeira vez que entramos nessa página),
	    // pesquisamos eles no banco de dados e os colocamos na variável de sessão $sessionStorage.
		$http.get(
		  "http://wspaciente.cfapps.io/getClinicas/"+
		  $sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
		    $sessionStorage.clinicas = data;
		    $scope.clinicas = data;
		}).error(function(data){
		  console.log(data);	
		});
		$http.get(
		  "http://wspaciente.cfapps.io/getProntoSocorros/"+
		  $sessionStorage.latReferencia+"/"+$sessionStorage.lonReferencia).success(function(data){
		    $sessionStorage.prontoSocorros = data;
		    $scope.prontoSocorros = data;
		}).error(function(data){
		  console.log(data);
		});
		$sessionStorage.isHospitalJaPesquisado = true;
      }*/
      
      // Colocamos um marcador para indicar onde o paciente se encontra.
      var markerPaciente = new google.maps.Marker({
         position : new google.maps.LatLng($sessionStorage.latReferencia,$sessionStorage.lonReferencia),
         icon     : "../img/voce.png",
         map      : $scope.map
      });
      
	  // Para cada clínica da lista de clínicas retornada, adicionados um marcador que irá 
	  // representar essa clínica no mapa.
	  for (var i = 0; i < clinicas.length; i++){
		 // Objeto da clínica.
         var clinica = clinicas[i];
		 // Adicionamos um marcador para essa clínica.
		 var marker  = new google.maps.Marker({
		   // A posição desse marcador será a localização dessa clínica (latitude e longitude), obtida no banco de dados.
		   position : new google.maps.LatLng(clinica.latitude,clinica.longitude),
		   // O ícone do marcador para clínicas será um C maiúsculo azul.
		   icon     : "../img/iconeClinica.png", 
		   // Adicionamos o mapa no qual o marcador será colocado, que será o mapa criado anteriormente.
		   map      : $scope.map,
		   // Adicionamos um título para o marcador, que será igual ao nome dessa clínica.
		   title    : clinica.nome
		 });
        
		 // Adicionamos um evento onclick para esse marcador já criado.
		 google.maps.event.addListener(marker,'click',function(){
		   // Ao clicarmos no marcador dessa clínica determinada, o zoom do mapa irá aumentar e a centralização
		   // do mapa será a localização dessa clínica.
		   $scope.map.setZoom(20);
		   $scope.map.setCenter(this.getPosition());
		   // Armazenamos os dados da clínica selecionada na variável de sessão $sessionStorage. Para isso, 
		   // obtemos o objeto dessa clínica com base em seu nome, que foi armazenado no título do marcador.
		   $sessionStorage.clinica = $scope.getClinica(this.getTitle());
		   // Pesquisamos todos os convênios que essa clínica possui, com base no id da clínica selecionada.
		   /*$http.get("http://wspaciente.cfapps.io/getConveniosPorClinica/"+$sessionStorage.clinica.id).success(function(data){
		     $sessionStorage.convenios = data;
		   }).error(function(data){
			 console.log(data);   
		   });*/
           $sessionStorage.convenios = [
             {
               id   : 1,
               nome : "Unimed" 
             },
             {
               id   : 2,
               nome : "Santa Tereza"
             },
             {
               id   : 3,
               nome : "Beneficência Portuguesa"
             }
           ];
		   // Pesquisamos todas as especialidades que essa clínica possui.
		   /*$http.get("http://wspaciente.cfapps.io/getEspecialidadesPorClinica/"+
		              $sessionStorage.clinica.nome).success(function(data){
		      $sessionStorage.especialidades = data;
		      // Entramos na área da clínica selecionada.
		      window.location.href = "areaEspecialidadeClinica.html";
		   }).error(function(data){
			 console.log(data);  
		   });*/
           $sessionStorage.especialidades = [
             {
               id   : 1,
               nome : "Reumatologia"
             },
             {
               id   : 2,
               nome : "Dermatologia"
             },
             {
               id   : 3,
               nome : "Otorrinolaringologia"
             },
             {
               id   : 4,
               nome : "Odontologia"
             }
           ];
           window.location.href = "areaEspecialidadeClinica.html";
		 });
		 // Adicionamos um evento onmouseover para esse marcador já criado. Quando o paciente
		 // passar o mouse por cima do marcador dessa clínica, seus dados principais serão exibidos.
		 google.maps.event.addListener(marker,'mouseover',function(){
		   var infowindow = new google.maps.InfoWindow({
		     content : this.getTitle()
		   });
		   infowindow.open($scope.map,this);
		 });
	  }

	  // Para cada pronto socorro da lista de pronto socorros retornada, adicionados um marcador que irá 
	  // representar essa pronto socorro no mapa.
	  for (i = 0; i < prontoSocorros.length; i++){
		 // Objeto do pronto socorro.
		 var prontoSocorro = prontoSocorros[i];
		 // Adicionamos um marcador para esse pronto socorro.
		 var marker = new google.maps.Marker({
		   // A posição desse marcador será a localização desse pronto socorro (latitude e longitude), obtida no banco de dados.
		   position : new google.maps.LatLng(prontoSocorro.latitude,prontoSocorro.longitude),
		   // O ícone do marcador para pronto socorros será um P maiúsculo azul.
		   icon     : "../img/iconePs.png",
		   // Adicionamos o mapa no qual o marcador será colocado, que será o mapa criado anteriormente.
		   map      : $scope.map,
		   // Adicionamos um título para o marcador, que será igual ao nome desse pronto socorro.
		   title    : prontoSocorro.nome
		 });
		 
		 // Adicionamos o evento onclick para esse marcador já criado.
		 google.maps.event.addListener(marker,'click',function(){
		   // Ao clicarmos no marcador desse pronto socorro determinado, o zoom do mapa irá aumentar e a centralização
		   // do mapa será a localização desse pronto socorro.
		   $scope.map.setZoom(20);
		   $scope.map.setCenter(this.getPosition());
		   // Armazenamos os dados do pronto socorro selecionado na variável de sessão $sessionStorage. Para isso, 
		   // obtemos o objeto desse pronto socorro com base em seu nome, que foi armazenado no título do marcador.
		   $sessionStorage.ps = $scope.getPs(this.getTitle());
		   // Pesquisamos todos os convênios que esse pronto socorro possui, com base no id do pronto socorro selecionado.
		   /*$http.get("http://wspaciente.cfapps.io/getConveniosPorPs/"+$sessionStorage.ps.id).success(function(data){
		     $sessionStorage.convenios = data; 
		   }).error(function(data){
		     console.log(data);   
		   });*/
           $sessionStorage.convenios = [
             {
               id   : 1,
               nome : "Unimed" 
             },
             {
               id   : 2,
               nome : "Santa Tereza"
             },
             {
               id   : 3,
               nome : "Beneficência Portuguesa"
             }
           ];
		   // Pesquisamos todas as especialidades que esse pronto socorro possui.
		   /*$http.get("http://wspaciente.cfapps.io/getEspecialidadesPorPs/"+
		              $sessionStorage.ps.nome).success(function(data){
		      $sessionStorage.especialidades = data;
		      window.location.href = "areaEspecialidadePs.html";
		   }).error(function(data){
			 console.log(data);  
		   });*/
           $sessionStorage.especialidades = [
             {
               id   : 1,
               nome : "Reumatologia"
             },
             {
               id   : 2,
               nome : "Dermatologia"
             },
             {
               id   : 3,
               nome : "Otorrinolaringologia"
             },
             {
               id   : 4,
               nome : "Odontologia"
             }
           ];
           window.location.href = "areaEspecialidadePs.html";     
		 });
		 // Adicionamos um evento onmouseover para esse marcador já criado. Quando o paciente
		 // passar o mouse por cima do marcador desse pronto socorro, seus dados principais serão exibidos.
		 google.maps.event.addListener(marker,'mouseover',function(){
		   var infowindow = new google.maps.InfoWindow({
		     content : this.getTitle()
		   });
		   infowindow.open($scope.map,this);
		 });
      }
   }
  // Faz o mapa ser inicializado de fato no evento onload da página.
  google.maps.event.addDomListener(window,'load',$scope.inicializarMapa);
  $scope.inicializarMapa();
});

app.controller("DadosMedicosController",function($http,$scope,$sessionStorage){
  $scope.medicos = $sessionStorage.medicos;
});

// Controller que irá tratar os eventos e os dados a serem realizados na área da clínica
// selecionada pelo paciente no mapa.
app.controller("AreaEspecialidadeClinicaController",function($http,$scope,$sessionStorage){
  // Obtem os dados clínica selecionada (bem como suas especialidades e seus convênios) e do paciente logado
  // da varíável de sessão $sessionStorage.
  $scope.clinica        = $sessionStorage.clinica;
  $scope.paciente       = $sessionStorage.paciente; 
  $scope.especialidades = $sessionStorage.especialidades;
  $scope.convenios      = $sessionStorage.convenios;
  
  // Pesquisamos todas as especialidades médicas da clínica selecionada tal que parte do nome da especialidade seja
  // igual ao texto digitado no campo txtEspecialidade. A tabela de especialidades é atualizada automaticamente por
  // conta do atributo ng-repeat do Angular.
  $scope.pesquisarEspecialidade = function(){
    var nome = $("#txtEspecialidade").val();
    if (nome != "")
      $http.get("http://wspaciente.cfapps.io/getEspecialidadesPorNomeClinica/"+nome+"/"+$scope.clinica.nome).success(function(data){
        $scope.especialidades = data;	
      }).error(function(data){
        console.log(data);	
      });
  };
  
  // Pesquisa todas as especialidades médicas da clínica selecionada. A tabela de especialidades é atualizada
  // automaticamente por conta do atributo ng-repeat do Angular.
  $scope.exibirTodas = function(){
    $scope.especialidades = $sessionStorage.especialidades;
  };
  
  // Método que trata as operações a serem realizadas com a especialidade selecionada, dentre todas as exibidas
  // na tabela de especialidades da clínica selecionada na página anterior.
  $scope.selecionarEspecialidade = function(indice){
	// Obtem o objeto da especialidade selecionada, através da indexação no vetor de especialidades armazenado,
	// por meio da variável indice, que é o número da linha selecionada na tabela de especialidades.
	$scope.especialidade = $scope.especialidades[indice];
	// Pesquisa todos os médicos dessa clínica que trabalham na especialidade selecionada.
	/*$http.get("http://wspaciente.cfapps.io/getMedicosPorEspecialidadeClinica/"+
			  $scope.especialidade.nome+"/"+$scope.clinica.nome).success(function(data){
	  // Armazena esses medicos na variável de sessão para serem exibidos na próxima página.
	  $sessionStorage.medicos = data;
    }).error(function(data){
      console.log(data);	
    });*/
      
    $sessionStorage.medicos = [
     {
        id   : 1,
        uf   : "SP",
        crm  : "1218218",
        nome : "Matheus Da Silva Ferraz"
     },
     {
        id   : 2,
        uf   : "SP",
        crm  : "1291202",
        nome : "Ana Clara Zoppi Serpa"
         
     },
     {
        id   : 3,
        uf   : "SP",
        crm  : "9181292",
        nome : "Maria Luiza Gonçalves Esteves"
         
     },
     {
        id   : 4,
        uf   : "SP",
        crm  : "0128192",
        nome : "Jimin Oshiro Nagasaki"
     }
    ];
      
    bootbox.alert({
	    title:"<h3><center><span>Especialistas em "+$scope.especialidade.nome.toLowerCase()+"</span></center></h3>",
	    message:function(){
	    // Ao clicar em uma determinada especialidade, uma lista de médicos que atuam nessa especialidade é exibida
	    // em uma tabela. O id de cada linha será o crm do médico cujos dados foram colocados lá dentro. Ao selecionar
	    // um determinado médico na tabela, iremos para uma outra página, que é a área de visualização dos dados 
	    // desse médico e das consultas que possui com o paciente logado. Obtemos o id da linha selecionada (CRM) e 
	    // adicionamos a variável crm diretamente na URL dessa nova página. 
	    var codigo = 
	    "<!DOCTYPE html>"+
	    "<html>"+
	     "<head>"+    
	       "<meta charset='utf-8'/>"+
	     "</head>"+
	     "<body>"+
		  "<table class='table table-hover'>"+     
		    "<thead>"+
		      "<tr class = 'row'>"+
			    "<th class = 'col-sm-9'>Nome</th>"+
				"<th class = 'col-sm-3'>CRM</th>"+
			  "</tr>"+
		    "</thead>"+
		    "<tbody>";
	        var medicos = $sessionStorage.medicos;
	        for (i = 0; i < medicos.length; i++){
	          var medico = medicos[i];
	          codigo +=
			  "<tr class = 'row'"+
			       "id = '"+medico.crm+"' "+
			       "onclick = \""+
                     "var crm = this.id;"+
			         "window.location.href = 'visualizaConsulta.html?crm='+crm;"+
			       "\""+
				   "onmouseover = \"this.style.cursor = 'pointer'\">"+
				  "<td class = 'col-sm-9'>"+medico.nome+"</td>"+
				  "<td class = 'col-sm-3'>"+medico.crm+"("+medico.uf+")</td>"+
			  "</tr>";
	        }
		codigo +=
		    "</tbody>"+      
	      "</table>"+
	     "</body>"+
	    "</html>";
		return codigo;
	    },
	    buttons:{
	      ok:{
		    label:"Voltar",
			class:"btn-primary"
		  }
		} 
	  }).find('.modal-content').css({
	    'max-height':'560px',
        'overflow-y':'auto'
	  }).scrollTop = 0;
  };
  
  //Método que exibe os dados da clínica selecionada pelo paciente no mapa na página anterior.
  $scope.exibirDadosClinica = function(){
    bootbox.alert({
      title:"<h3><center><span>"+$scope.clinica.nome+"</span></center></h3>",
	  message:$("#dadosClinica").html(),
	  buttons:{
	    ok:{
		 label:"Voltar",
		 class:"btn-primary"
		}
	  } 
   }).find('.modal-content').css({
	 'max-height':'560px',
     'overflow-y':'auto'
   }).scrollTop = 0;
  };
});

// Controller que manipula as operações na área que o paciente entra após selecionar um determinado médico.
// Aqui será realizado o CRUD de consultas do paciente com base no médico e clínica selecionados anteriormente.
app.controller("ConsultasController",function($http,$scope,$sessionStorage,$filter){
  var medicos = $sessionStorage.medicos;
  $scope.paciente = $sessionStorage.paciente;
    
  $scope.getMedico = function(crm){
	for (i = 0 ; i < medicos.length; i++)
      if (medicos[i].crm == crm)
        return medicos[i];
  };
    
  // Obtém o crm do médico selecionado anteriormente através da URL.
  var crm = window.location.search.slice(5);
  $scope.medico = $scope.getMedico(crm);
  $sessionStorage.medico = $scope.medico;
    
  // Obtem os dados da clínica selecionada anteriormente e do paciente logado da variável de sessão $sessionStorage.
  $scope.clinica  = $sessionStorage.clinica;
  $scope.paciente = $sessionStorage.paciente;
    
  $scope.consultas = [
   {
    id       : 1,
    paciente : $scope.paciente,
    horario  : {
      id : 1,
      medico : {
          id   : 1,
          uf   : "SP",
          crm  : "1218218",
          nome : "Matheus Da Silva Ferraz"
      },
      clinica : {
          id        : 2,
          bairro    : "Vila Itapura",
          endereco  : "Rua Sacramento, 900",
          nome      : "Centro Clínico Sacramento",
          telefone  : "1932325097",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.8961645,
          longitude : -47.0640828
      },
      data       : "27/09/2016",
      horaInicio : "08:00",
      horaFim    : "08:20"
    }
   }
  ];
  $scope.especialidadesMedico = [
    {
      id   : 1,
      nome : "Reumatologia"
    },
    {
      id   : 2,
      nome : "Dermatologia"
    },
    {
      id   : 3,
      nome : "Otorrinolaringologia"
    },
    {
      id   : 4,
      nome : "Odontologia"
    }
  ];
  $sessionStorage.especialidadesMedico = $scope.especialidadesMedico;
  /*
  $http.get("http://wspaciente.cfapps.io/getMedicoPorCrm/"+crm).success(function(data){
	// Obtém o objeto do médico cujo crm é o obtido anteriormente e armazena esses dados no $sessionStorage.
	$scope.medico = data;
	$sessionStorage.medico = data;
	// Obtém as especialidades em que esse médico trabalha e armazena-as no $sessionStorage.
	$http.get("http://wspaciente.cfapps.io/getEspecialidades/"+$scope.medico.id).success(function(data){
	  $scope.especialidadesMedico = data;	
	  $sessionStorage.especialidadesMedico = data;
	}).error(function(data){
	  console.log(data);	
	});
	// Exibe todas as consultas que esse paciente possui com esse médico, nessa clínica.
  }).error(function(data){
	console.log(data);  
  });*/
  
  // A variável data abaixo está relacionada ao campo txtData por meio do atributo ng-model, ou seja
  // ao alterarmos o valor da data no txtData, a variável aqui é atualizada automaticamente.
  $scope.data = null;
  // Pesquisamos todas as consultas que esse paciente possui com esse determinado médico, nessa
  // determinada clínica, nessa determinada data. A tabela de consultas é atualizada automaticamente
  // por conta to atributo ng-repeat.
  $scope.pesquisarConsulta = function(){
    $http.get("http://wspaciente.cfapps.io/getConsultasPorDataMedicoClinica/"+
    		  $scope.data.getFullYear()+"-"+
    	      ($scope.data.getMonth()+1)+"-"+
    	      $scope.data.getDate()+"/"+
    	      $scope.medico.id+"/"+$scope.clinica.id).success(function(data){
      $scope.consultas = data;	    	  
    }).error(function(data){
      console.log(data);	
    });
  };
  
  // Exibe os dados do médico: nome, CRM e especialidades em que atua.
  $scope.exibirDadosMedico = function(){
	  bootbox.alert({
	      title:
	    	"<center>"+
	    	  "<div class = 'form-group'>"+
	            "<h3><span>"+$scope.medico.nome+"</span></h3>"+
	            "<h5><span>CRM: "+$scope.medico.crm+"("+$scope.medico.uf+")</span></h5>"+
	          "</div>"+
	        "</center>",
	      message:$("#dadosMedico").html(),
	      buttons:{
	        ok:{
	          label:"Voltar",
	          class:"btn-primary"
	        }
	      }
	  }).find('.modal-content').css({
	      'max-height':'500px',
	      'overflow-y':'auto'
	  }).scrollTop = 0;
  };
  
  // Fecha o alert que indica quando uma consulta foi cancelada com sucesso.
  $scope.fecharAlert = function(){
    $("#alertExclusaoConsulta").hide();	 
  };
  
  // Método que exibe os dados da consulta selecionada (dados da clínica,dados do médico,dados do paciente
  // e dados do horário da consulta) e fornece operações a serem realizadas com essa consulta, que são
  // cancelar e reagendar.
  $scope.selecionarConsulta = function(indice){
	// Obtemos o objeto da consulta selecionada através da indexação no vetor de consultas armazenado, com base
	// na variável indice, que é o número da linha selecionada na tabela de consultas.
	// Armazena os dados dessa consulta no $sessionStorage.
	$sessionStorage.consulta = $scope.consultas[indice];
	$scope.fecharAlert();
	bootbox.dialog({
	  message:function(){
        var consulta      = $sessionStorage.consulta;
        var nomeClinica   = "Centro Clínico Sacramento"
        var cidadeClinica = "Campinas";
        var ufClinica     = "SP";
        var nomeMedico    = "Matheus Da Silva Ferraz";
        var crmMedico     = "1218218";
        var ufMedico      = "SP";
        var nomePaciente  = "Matheus Esteves Zanoto";
        var horaInicio    = "08:00";
        var horaFim       = "08:20";
        var dataConsulta  = "27/09/2016";
        var cpfPaciente   = "470.654.558-74";
        return
		"<style>"+
		 ".titulo"+
         "{"+  
          "color:#003074;"+
          "font-size:19px;"+
         "}"+
		"</style>"+
        "<div class = 'form-group'>"+
          "<label class = 'titulo'>Clínica</label><br>"+
          "<label>Nome: </label><span>Centro Clínico Sacramento</span><br>"+
          "<label>Cidade: </label><span>Campinas(SP)</span>"+
        "</div>"+
        "<div class = 'form-group'>"+
          "<label class = 'titulo'>Médico</label><br>"+
          "<label>Nome: </label><span>Matheus Da Silva Ferraz</span><br>"+
          "<label>CRM: </label><span>1218218(SP)</span>"+
        "</div>"+
        "<div class = 'form-group'>"+
          "<label class = 'titulo'>Paciente</label><br>"+
          "<label>Nome: </label><span>Matheus Esteves Zanoto</span><br>"+
          "<label>CPF: </label>"+
          "<span> "+ 
            "470.654.558-74"+
          "</span>"+
        "</div>"+
        "<div class = 'form-group'>"+
          "<label class = 'titulo'>Horário</label><br>"+
          "<label>Data: </label>"+
          "<span>27/09/2016</span><br>"+
          "<label>Início da consulta: </label>"+
          "<span>08:00</span><br>"+
          "<label>Término da consulta: </label>"+
          "<span>08:20</span>"+
        "</div><br>"+
        "<div class = 'form-group'>"+
          "<span style = 'font-family:Arial;font-size:16px;'>"+
            "O que você deseja realizar com essa consulta ?"+
          "</span>"+
        "</div>";
      },		 
	  buttons:{
		btnVoltar:{
		  label:"Voltar",
		  class:"btn-default"
		},
	    btnCancelar:{
	      label:"Cancelar",
	      class:"btn-default",
	      // Caso desejarmos cancelar a consulta.
	      callback:function(){
	        $scope.mensagem = "Deseja realmente cancelar essa consulta ?";
	        bootbox.dialog({
	        	message:function(){
                   var consulta = $sessionStorage.consulta;
                   return 
	        		"<style>"+
	        		 ".titulo"+
	                 "{"+  
	                  "color:#003074;"+
	                  "font-size:19px;"+
	                 "}"+
	        		"</style>"+
	                "<div class = 'form-group'>"+
	                  "<label class = 'titulo'>Clínica</label><br>"+
	                  "<label>Nome: </label><span>Centro Clínico Sacramento</span><br>"+
	                  "<label>Cidade: </label><span>Campinas(SP)</span>"+
	                "</div>"+
	                "<div class = 'form-group'>"+
	                  "<label class = 'titulo'>Médico</label><br>"+
	                  "<label>Nome: </label><span>Matheus Da Silva Ferraz</span><br>"+
	                  "<label>CRM: </label><span>1218218(SP)</span>"+
	                "</div>"+
	                "<div class = 'form-group'>"+
	                  "<label class = 'titulo'>Paciente</label><br>"+
	                  "<label>Nome: </label><span>Matheus Esteves Zanoto</span><br>"+
	                  "<label>CPF: </label>"+
	                  "<span> "+ 
	                    "470.654.558-74"+
	                  "</span>"+
	                "</div>"+
	                "<div class = 'form-group'>"+
	                  "<label class = 'titulo'>Horário</label><br>"+
	                  "<label>Data: </label>"+
	                  "<span>27/09/2016</span><br>"+
	                  "<label>Início da consulta: </label>"+
	                  "<span>08:00</span><br>"+
	                  "<label>Término da consulta: </label>"+
	                  "<span>08:20</span>"+
	                "</div><br>"+
	                "<div class = 'form-group'>"+
	                  "<span style = 'font-family:Arial;font-size:16px;'>"+
	                    "Deseja realmente cancelar essa consulta ?"+
	                  "</span>"+
	                "</div>";
              },  
	          buttons:{
	            btnNao:{
	              label:"Não",
	              class:"btn-default"
	            },
	            btnSim:{
	              label:"Sim",
	              class:"btn-primary",
	              callback:function(){
	            	// Cancelamos a consulta excluindo seu registro no banco de dados e excluimos também a consulta 
	                // do vetor de consultas armazenado no cliente, atualizando automaticamente a tabela de consultas
	            	// por conta do atributo ng-repeat do Angular.
	                //$http.get("http://wspaciente.cfapps.io/cancelarConsulta/"+$scope.consulta.id).success(function(data){
	                  $scope.consultas.splice(indice,1);
	                  $("#alertExclusaoConsulta").show();	
	                /*}).error(function(data){
	                  console.log(data);	
	                });*/
	              }
	            }
	          }
	        });
	      }
	    },
	    btnReagendar:{
	      label:"Reagendar",
	      class:"btn-primary",
	      // Caso desejarmos alterar uma consulta.
	      callback:function(){
            window.location.href = "alteraConsulta.html";   
	      }
	    }
	  }
	});
  };
});

// Controller que tratará as operações para a alteração de uma consulta. O que o paciente terá direito à
// alterar será o horário dessa consulta. Serão exibidos todos os horários livres do médico determinado
// na clínica determinada e o paciente poderá selecionar um deles.
app.controller("AlteracaoConsultaController",function($http,$scope,$sessionStorage,$filter){
  // Obtem os dados da consulta a ser alterada e as especialidades do médico selecionado anteriormente
  // da variável de sessão $sessionStorage.
  $scope.consulta = $sessionStorage.consulta;
  $scope.especialidadesMedico = $sessionStorage.especialidadesMedico;
  
  // Pesquisamos todos os horários livres desse determinado médico, nessa determinado clinica.
  /*$http.get("http://wspaciente.cfapps.io/getHorariosLivresPorMedicoClinica/"+
		    $scope.consulta.horario.medico.id+"/"+$scope.consulta.horario.clinica.id).success(function(data){
	// Os horários livres são atualizados na tabela de horários livres automaticamente por conta do atributo
	// ng-repeat do Angular e também são armazenados no $sessionStorage.
	$scope.horarios = data;
	$sessionStorage.horarios = data;
  }).error(function(data){
	console.log(data);  
  });*/
    
  $scope.horarios = [
    {
      id : 1,
      medico : {
          id   : 1,
          uf   : "SP",
          crm  : "1218218",
          nome : "Matheus Da Silva Ferraz"
      },
      clinica : {
          id        : 2,
          bairro    : "Vila Itapura",
          endereco  : "Rua Sacramento, 900",
          nome      : "Centro Clínico Sacramento",
          telefone  : "1932325097",
          cidade    : "Campinas",
          uf        : "SP",
          latitude  : -22.8961645,
          longitude : -47.0640828
      },
      data       : "27/09/2016",
      horaInicio : "10:00",
      horaFim    : "10:20"
    }     
  ];
  
  // A variável data abaixo está relacionada ao campo txtData por meio do atributo ng-model, ou seja
  // ao alterarmos o valor da data no txtData, a variável aqui é atualizada automaticamente.
  $scope.data = null;
  // Pesquisamos todos os horários livres desse determinado médico, nessa determinada clínica, 
  // nessa determinada data. A tabela de horários livres é atualizada automaticamente por conta to atributo ng-repeat.
  $scope.pesquisarHorario = function(){
    $http.get("http://wspaciente.cfapps.io/getHorariosLivresPorDataMedicoClinica/"+
    		  $scope.data.getFullYear()+"-"+
    	      ($scope.data.getMonth()+1)+"-"+
    	      $scope.data.getDate()+"/"+
    	      $scope.consulta.horario.medico.id+"/"+$scope.consulta.horario.clinica.id).success(function(data){
      $scope.horarios = data;	    	  
    }).error(function(data){
      console.log(data);	
    });
  };
  
  // Exibe todos os horários livres.
  $scope.exibirTodos = function(){
    $scope.horarios = $sessionStorage.horarios;
  };
  
  // Exibe os dados do médico selecionado anteriormente: nome, CRM e especialidades em que atua.
  $scope.exibirDadosMedico = function(){
	  bootbox.alert({
	      title:
	    	"<center>"+
	    	  "<div class = 'form-group'>"+
	            "<h3><span>"+$scope.consulta.horario.medico.nome+"</span></h3>"+
	            "<h5><span>CRM: "+$scope.consulta.horario.medico.crm+"("+$scope.consulta.horario.medico.uf+")</span></h5>"+
	          "</div>"+
	        "</center>",
	      message:$("#dadosMedico").html(),
	      buttons:{
	        ok:{
	          label:"Voltar",
	          class:"btn-primary"
	        }
	      }
	  }).find('.modal-content').css({
	      'max-height':'500px',
	      'overflow-y':'auto'
	  }).scrollTop = 0;
  };
  
  // Método que controla a operação de reagendamento a ser realizada ao selecionar um determinado horário livre.
  $scope.selecionarHorario = function(indice){
	// Obtém o objeto do horário livre selecionado, através da indexação no vetor de horários livres armazenado,
	// com base na variável indice, que é o número da linha selecionada na tabela de horários livres.
    $scope.horario = $scope.horarios[indice];

    	// Caso ele não possua essa consulta, a página de reagendamento é liberada.
        bootbox.dialog({
          message:$("#alteracaoConsulta").html(),
          buttons:{
            btnNao:{
              label:"Não",
           	  class:"btn-default"
            },
            btnSim:{
              label:"Sim",
           	  class:"btn-primary",
           	  callback:function(){
           		// A consulta é reagendada de fato, com base na mudança de horário.
           		$scope.consulta.horario = $scope.horario;
           		$sessionStorage.consulta = $scope.consulta;
           		$scope.consulta.paciente.senha = "senha";
           	    /*$http.post("http://wspaciente.cfapps.io/alterarConsulta",$scope.consulta).success(function(data){
       	    	  $scope.horarios.splice(indice,1);
       			  $sessionStorage.horarios = $scope.horarios;
       			  $("#alertAlteracaoConsulta").show();
       	    	}).error(function(data){
       	    	  console.log(data);
       	    	});*/
                $scope.horarios.splice(indice,1);
       	        $sessionStorage.horarios = $scope.horarios;
       	        $("#alertAlteracaoConsulta").show();
           	  }
            }
          }
        });  
  };
});

//Controller que irá tratar os eventos e os dados a serem realizados na área do pronto socorro
//selecionado pelo paciente no mapa.
app.controller("AreaEspecialidadePsController",function($http,$scope,$sessionStorage){
  // Armazena os dados do pronto socorro selecionado no mapa (bem como seus convênios e especialidades) e os
  // dados do paciente logado, através da variável de sessão $sessionStorage.
  $scope.prontoSocorro  = $sessionStorage.ps;
  $scope.paciente       = $sessionStorage.paciente;
  $scope.especialidades = $sessionStorage.especialidades;
  $scope.convenios      = $sessionStorage.convenios;
  
  // Pesquisamos todas as especialidades desse pronto socorro, tal que parte do nome dessa especialidade seja igual
  // ao texto digitado no campo txtEspecialidade. A tabela de especialidades é atualizada automaticamente por conta
  // do atributo ng-repeat do Angular.
  $scope.pesquisarEspecialidade = function(){
    var nome = $("#txtEspecialidade").val();
    if (nome != "")
	  $http.get("http://wspaciente.cfapps.io/getEspecialidadesPorNomePs/"+nome+"/"+$scope.prontoSocorro.nome).success(function(data){
	    $scope.especialidades = data;
	  }).error(function(data){
	    console.log(data);	
	  });
  };
	  
  // Todas as especialidades do pronto socorro são exibidas.
  $scope.exibirTodas = function(){
    $scope.especialidades = $sessionStorage.especialidades;
  };
  
  // Exibimos os dados do pronto socorro selecionado no mapa anteriormente.
  $scope.exibirDadosPs = function(){
    bootbox.alert({
	  title:"<h3><center><span>"+$scope.prontoSocorro.nome+"</span></center></h3>",
	  message:$("#dadosPs").html(),
	  buttons:{
	    ok:{
		  label:"Voltar",
		  class:"btn-primary"
		}
	  } 
	}).find('.modal-content').css({
	  'max-height':'560px',
	  'overflow-y':'auto'
	}).scrollTop = 0;
  };
  
  // Tratamento dos dados ao selecionar uma determinada especialidade médica dentre todas as exibidas
  // na tabela de especialidades.
  $scope.selecionarEspecialidade = function(indice){
	// Obtém o objeto da especialidade selecionada, através da indexação no vetor de especialidades armazenado, com base
	// na variável indice, que é o número da linha selecionada nessa tabela de especialidades.
    $scope.especialidade = $scope.especialidades[indice];
    // Ao selecionar determinada especialidade, pesquisamos todos os médicos de plantão nesse
    // pronto socorro que trabalham nessa especialidade. Exibimos esses médicos em uma tabela, a
    // qual é atualizada por conta do atributo ng-repeat do Angular.
    $http.get("http://wspaciente.cfapps.io/getMedicosPlantaoPorEspecialidadePs/"+
			  $scope.especialidade.id+"/"+$scope.prontoSocorro.id).success(function(data){
	  $sessionStorage.medicos = data;
	  
	  bootbox.alert({
		    title:"<h3><center><span>Médicos em plantão</span></center></h3>",
		    message:function(){
		    var codigo = 
		    "<!DOCTYPE html>"+
		    "<html>"+
		     "<head>"+    
		       "<meta charset='utf-8'/>"+
		     "</head>"+
		     "<body>"+
			  "<table class='table table-hover'>"+     
			    "<thead>"+
			      "<tr class = 'row'>"+
				    "<th class = 'col-sm-9'>Nome</th>"+
					"<th class = 'col-sm-3'>CRM</th>"+
				  "</tr>"+
			    "</thead>"+
			    "<tbody>";
		        var medicos = $sessionStorage.medicos;
		        for (i = 0; i < medicos.length; i++){
		          var medico = medicos[i];
		          codigo +=
				  "<tr class = 'row'"+
				       "id = '"+medico.crm+"'"+
					   "onmouseover = \"this.style.cursor = 'pointer'\">"+
					  "<td class = 'col-sm-9'>"+medico.nome+"</td>"+
					  "<td class = 'col-sm-3'>"+medico.crm+"("+medico.uf+")</td>"+
				  "</tr>";
		        }
			codigo +=
			    "</tbody>"+      
		      "</table>"+
		     "</body>"+
		    "</html>";
			return codigo;
		    },
		    buttons:{
		      ok:{
			    label:"Voltar",
				class:"btn-primary"
			  }
			} 
		  }).find('.modal-content').css({
		    'max-height':'560px',
	        'overflow-y':'auto'
		  }).scrollTop = 0;
	}).error(function(data){
	  console.log(data);	
	});
  };
});

// Controller para controlar o agendamento de consultas. São exibidos todos os horários livres
// do médico determinado e o paciente poderá escolher um para agendar a sua consulta.
app.controller("HorariosLivresController",function($http,$scope,$sessionStorage,$filter){
  // Os dados da clínica selecionada, do médico selecionado (bem como suas especialidades) e 
  // do paciente logado são obtidos a partir do $sessionStorage.
  $scope.medico               = $sessionStorage.medico;
  $scope.clinica              = $sessionStorage.clinica;
  $scope.paciente             = $sessionStorage.paciente;
  $scope.especialidadesMedico = $sessionStorage.especialidadesMedico;
 
  // Pesquisamos todos os horários livres que esse médico possui nessa clínica.
  $http.get("http://wspaciente.cfapps.io/getHorariosLivresPorMedicoClinica/"+
		    $scope.medico.id+"/"+$scope.clinica.id).success(function(data){
	// Os horários livres são atualizados automaticamente na tabela de horários livres por
	// conta do atributo ng-repeat do Angular. Eles também são atualizados no $sessionStorage.
	$scope.horarios = data;
	$sessionStorage.horarios = data;
  }).error(function(data){
	console.log(data);  
  });
  
  // A variável data abaixo está relacionada ao campo txtData por meio do atributo ng-model, ou seja
  // ao alterarmos o valor da data no txtData, a variável aqui é atualizada automaticamente.
  $scope.data = null;
  // Pesquisamos todos os horários livres desse determinado médico, nessa determinada clínica, 
  // nessa determinada data. A tabela de consultas é atualizada automaticamente por conta to atributo ng-repeat.
  $scope.pesquisarHorario = function(){
    $http.get("http://wspaciente.cfapps.io/getHorariosLivresPorDataMedicoClinica/"+
    		  $scope.data.getFullYear()+"-"+
    	      ($scope.data.getMonth()+1)+"-"+
    	      $scope.data.getDate()+"/"+
    	      $scope.medico.id+"/"+$scope.clinica.id).success(function(data){
      $scope.horarios = data;	    	  
    }).error(function(data){
      console.log(data);	
    });
  };
  
  // Exibimos todos os horários livres desse determinado médico, nessa determinada clínica.
  $scope.exibirTodos = function(){
    $scope.horarios = $sessionStorage.horarios;
  };
  
  // Exibimos os dados do médico selecionado anteriormente: nome, CRM e especialidades em que atua.
  $scope.exibirDadosMedico = function(){
	  bootbox.alert({
	      title:
	    	"<center>"+
	    	  "<div class = 'form-group'>"+
	            "<h3><span>"+$scope.medico.nome+"</span></h3>"+
	            "<h5><span>CRM: "+$scope.medico.crm+"("+$scope.medico.uf+")</span></h5>"+
	          "</div>"+
	        "</center>",
	      message:$("#dadosMedico").html(),
	      buttons:{
	        ok:{
	          label:"Voltar",
	          class:"btn-primary"
	        }
	      }
	  }).find('.modal-content').css({
	      'max-height':'500px',
	      'overflow-y':'auto'
	  }).scrollTop = 0;
  };
  
  // Realiza a operação de agendamento quando selecionamos um determinado horário dentre todos os horários 
  // livres exibidos na tabela.
  $scope.selecionarHorario = function(indice){
	// Obtemos o objeto do horário selecionado através da indexação no vetor de horários, com base
	// na variável indice, que é o número da linha seleciona na tabela de horários livres.
	$sessionStorage.horario = $scope.horarios[indice];
	$scope.horario = $scope.horarios[indice];
	
	// Verificamos se o paciente logado possui alguma consulta já agendada com outro médico ou em outra
	// clínica na mesma data e por volta do mesmo período.
	$http.post("http://wspaciente.cfapps.io/getConsultasPorHorario",$scope.horario).success(function(data){
      if (data.length > 0){
    	// Caso tenha essa consulta, os seus dados são exibidos: dados da clínica, dados do médico, 
    	// dados paciente e dados do horário e a página de agendamento não é liberada.
	    $scope.consultaAgendada = data[0];
	    bootbox.alert({
	 	  message:$("#consultaAgendada").html(),
	 	  buttons:{
	 	    ok:{
	 	      label:"Voltar",
	 	      class:"btn-primary"
	 	    }
	 	  }
	 	});    
	  }
	  else{
		// Caso não tenha essa consulta, a página de agendamento é liberada.
	    bootbox.dialog({
	      message:$("#inclusaoConsulta").html(),
	      buttons:{
	        btnNao:{
	          label:"Não",
	          class:"btn-default"
	        },
	        btnSim:{
	          label:"Sim",
	          class:"btn-primary",
	          callback:function(){
	        	// Montamos o objeto da nova consulta, a qual terá somente
	        	// o horário alterado. O paciente será prenchido automaticamente
	        	// no próprio web service com base no objeto do paciente logado.
	            var consulta = {
	         	  id       : 0,
	         	  paciente : null,
	         	  horario  : $scope.horario
	         	};
	            // Cadastramos essa consulta no banco de dados, efetivamente, e atualizamos o vetor de
	            // de horários livres no cliente. A tabela de horários livres é atualizada automaticamente
	            // por conta do atributo ng-repeat do Angular. Também atualizamos esses horários livres 
	            // na variável de sessão $sessionStorage.
	         	$http.put("http://wspaciente.cfapps.io/agendarConsulta",consulta).success(function(data){
	         	  $scope.horarios.splice(indice,1);
	              $sessionStorage.horarios = $scope.horarios;
	         	  $("#alertInclusaoConsulta").show();
	         	}).error(function(data){
	         	  console.log(data);
	         	});
	          }
	        }
	      }
	    });  
	  }      
	}).error(function(data){
	  console.log(data);	
	});
  };
  // Fechamos o alert que indica quando uma consulta foi agendada com sucesso.
  $scope.fecharAlert = function(){
    $("#alertInclusaoConsulta").hide();	
  };
});

// Controller que trata as operações necessárias para o cadastro de paciente no banco de dados.
app.controller("CadastroPacienteController",function($http,$scope){
  // Objeto com os dados do paciente a serem cadastrados. cada atributo dele está relacionado
  // à algum campo do formulário pelo ng-model do Angular, ou seja, ao preencher algum dos campos
  // no formulário, os atributos desse objeto são atualizados automaticamente.
  $scope.paciente = {
    id             : 0,
	nome           : "",
	cpf            : "",
	telefone       : "",
	celular        : "",
	cep            : "",
	bairro         : "",
	complemento    : "",
	senha          : "",
	cidade         : "",
	uf             : "",
	endereco       : "",
	dataNascimento : null 
  };
  
  // Informações à parte, que irão compor o endereço posteriormente.
  $scope.logradouro = "";
  $scope.numero = "";
  $scope.cpf = "";
  $scope.celular = "";
  $scope.telefone = "";
  
  // Indica se o cep digitado corresponde à um cep existente ou não.
  $scope.isCepValido = false;
  // Pesquisa um endereço no site viacep com base em um número de cep.
  $scope.pesquisarEndereco = function(){
	if ($scope.paciente.cep.length == 9 && $scope.paciente.cep != "")
	  // O site viacep retorna um objeto no formato json com base no cep fornecido como parâmetro.
      $http.get('http://viacep.com.br/ws/'+$scope.paciente.cep+'/json/').success(function(endereco){
          if(!endereco.erro)
          {
            $("#campoNaoLocalizado").hide();
            $scope.isCepValido = true;
            // Obtemos os dados essenciais a partir do endereço obtido, como rua, bairro, cidade e sigla do estado.
            $scope.paciente.bairro = endereco.bairro;     // Nome do bairro
            $scope.paciente.cidade = endereco.localidade; // Nome da cidade
            $scope.paciente.uf     = endereco.uf;         // Sigla do estado
            $scope.logradouro      = endereco.logradouro; // Nome da rua  
            document.getElementById("txtNumero").focus();
          }
          else
              {
                  $scope.isCepValido = false;
                  $("#campoNaoLocalizado").show();
                  $scope.paciente.bairro = "";
                  $scope.paciente.cidade = "";
                  $scope.paciente.uf = "";
                  $scope.logradouro = "";
              }
    
      }).error(function(data){
    	// Não achamos nenhum endereço com base nesse cep, logo ele não existe e portanto exibimos uma
    	// mensagem para avisar o usuário.
    	$scope.isCepValido = false;
        $("#campoNaoLocalizado").show();	
      });
	else{
	  $("#campoNaoLocalizado").hide();
	  $scope.isCepValido = false;
	}
  };
  
  $scope.isCpfExistente = false;
  // Verificamos se já existe algum paciente cadastrado com o cpf digitado.
  $scope.pesquisarCpf = function(){
	var cpf = $scope.cpf;
    if (cpf.length == 14){
      // No formulário, o cpf está formatado com ponto(.) e traço(-). Devemos retirá-los
      // para enviar o cpf como parâmetro no método getIdPaciente.
      cpf = cpf.replace(".","").replace(".","").replace("-","");
      // Pesquisamos o id do paciente cujo cpf é igual ao informado pelo parâmetro. Caso método retorne 0,
      // significa que não há paciente com cpf igual ao do parâmetro.
      $http.get("http://wspaciente.cfapps.io/getIdPaciente/"+cpf).success(function(idPaciente){
        if (idPaciente != 0){
          $("#cpfExistente").show();
          $scope.isCpfExistente = true;
        }
        else{
          $("#cpfExistente").hide();
          $scope.isCpfExistente = false;
        }
      }).error(function(erro){
    	console.log(erro);  
      });
    }
    else{
      $("#cpfExistente").hide();
      $scope.isCpfExistente = false;
    }
  };
	
  // Método que reúne os dados e cadastra um paciente no banco de dados, efetivamente.
  $scope.cadastrarPaciente = function(){
      bootbox.dialog({
       	 message:"O seu cadastro foi realizado com sucesso. Clique em prosseguir abaixo para a realização do login",
       	 buttons:{
       	   btnProsseguir:{
       	     label:"Prosseguir",
       	     class:"btn-primary",
       	     callback:function(){
       	       window.location.href = "loginPaciente.html"	 
       	     }
       	   }   
       	 }	       	 
      });
  };
});

})();