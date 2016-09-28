(function(){

// Inicia um módulo para uma aplicação Angular e utiliza as configurações
// do ngStorage (entre colchetes), o qual será responsável pela existência
// da variável de sessão SessionStorage.
var app = angular.module("operacoesAdministrador",["ngStorage"]);

//Controller para a realização da conexão com o banco de dados remoto do PIVOTAL,
//através do método conectarBd do Web Service de pacientes, também no PITOVAL.
app.controller("ConexaoBdController",function($http,$scope){
   $scope.conectarBd = function(){
	 // Se a conexão for realizada, isConectado = true, caso contrário, isConectado = false.
     $http.get("http://wsadministrador.cfapps.io/conectarBd").
		success(function(data){
	      $scope.isConectado = data;
     }).error(function(erro){
       console.log(erro);
     });
   };
});

//Controller para a realização do login do administrador.
app.controller("LoginAdmController",function($http,$scope,$sessionStorage){
  // Objeto com os dados necessários para a realização do login de administrador. Ao preencher esses
  // dados no formulário de login, os atributos do objeto serão atualizados automaticamente.
  $scope.adm = {
    usuario:'',
    senha:''
  };	  

  // Método para a realização do login de administrador.
  $scope.loginAdm = function(){
      
	// Verifica se existe administrador com esse usuario e essa senha trabalhando em alguma clínica ou
	// em algum pronto socorro, ou seja, se há algum registro na tabela AdmClinica ou AdmPs tal que o
	// id do administrador seja igual ao id do administrador com usuário e senha iguais aos digitados
	// nesse formulário de login de administrador.
    $http.post("http://wsadministrador.cfapps.io/isAdmClinica",$scope.adm).success(function(isAdmClinica){
      $scope.isAdmClinica = isAdmClinica;
        
        // Caso exista administrador com esses dados trabalhando em alguma clínica, pesquisamos todas as clínicas
    	// que esse administrador trabalha e as armazenamos na variável de sessão $sessionStorage.
      if (isAdmClinica)    	
        $http.get("http://wsadministrador.cfapps.io/getClinicas").success(function(clinicas){ //#### não pode exibir todas as clínicas, só as relacionadas ao adm
          $sessionStorage.clinicas = clinicas;
        }).error(function(erro){
          console.log(erro);	
        });        
    }).error(function(erro){
        console.log(erro);	
       });
   
    $http.post("http://wsadministrador.cfapps.io/isAdmPs",$scope.adm).success(function(isAdmPs){
	$scope.isAdmPs = isAdmPs;
		
        // Caso exista administrador com esses dados trabalhando em algum pronto socorro, pesquisamos todas os
        // pronto socorros que esse administrador trabalha e os armazenamos na variável de sessão $sessionStorage.    
        if (isAdmPs)		  
              $http.get("http://wsadministrador.cfapps.io/getProntoSocorros").success(function(prontoSocorros){ //#### não pode exibir todos os ps, só as relacionadas ao adm
                $sessionStorage.prontoSocorros = prontoSocorros;
                $sessionStorage.usuario = $scope.adm.usuario;
                window.location.href = "homeAdm.html";
              }).error(function(erro){
                console.log(erro);  
              });
            else
              if ($scope.isAdmClinica){
                $sessionStorage.usuario = $scope.adm.usuario;
                window.location.href = "homeAdm.html";
              }
          }).error(function(erro){
            console.log(erro);	
          });

          // Caso não exista administrador com esse usuário e essa senha trabalhando em alguma clínica
          // ou em algum pronto socorro, exibimos a mensagem abaixo.
          if (!$scope.isAdmClinica && !$scope.isAdmPs)
            bootbox.dialog({
              message: 'O usuário e a senha que você digitou não coincidem.',
              buttons:{btnVoltar:{label:"Voltar",class:"btn-pimary"}}
            });
      
  };
    
});
    
//Controller responsável pelo cadastro de médico
app.controller("CadastrarMedicoController",function($http,$scope, $sessionStorage){
    
    $scope.clinica = $sessionStorage.clinica;
    $scope.ps = $sessionStorage.ps;    
    $scope.medico = {
       id: 0,
       uf: '',
       crm: '', 
       nome: ''
    };
        
    $scope.senha = '';
    
    
    $http.get("http://wsadministrador.cfapps.io/getEstados").success(function(estados){          
          $scope.estados = estados;          
    }).error(function(erro){
          console.log(erro);	
        });  
    
    
    
    $scope.cadastrarMedico = function()
    {        
        if($scope.ps)
        {
            var medicoPs = {
              medico: $scope.medico                
            };
            
            //Cadastra o médico no banco e o relaciona a um pronto-socorro
            $http.put("http://wsadministrador.cfapps.io/incluirMedicoPs", medicoPs).success(function(data){

              bootbox.dialog({
                 message:"O seu cadastro foi realizado com sucesso.",
                 buttons:{
                   btnProsseguir:{
                     label:"Prosseguir",
                     class:"btn-primary",
                     callback:function(){
                       window.location.href = "ps/homeAdmPs.html"	 
                     }
                   }   
                 }	       	 
              });

            }).error(function(data){
              console.log(data);	
            });        
        }
        else
            {
                 var medicoClinica = {
                     medico: $scope.medico,
                     senha: $scope.senha
                 }
                 
                //Cadastra o médico no banco e o relaciona a uma clínica ****verificar o porquê o incluir está dando internal error
                $http.put("http://wsadministrador.cfapps.io/incluirMedicoClinica",medicoClinica).success(function(data){

                  bootbox.dialog({
                     message:"O seu cadastro foi realizado com sucesso.",
                     buttons:{
                       btnProsseguir:{
                         label:"Prosseguir",
                         class:"btn-primary",
                         callback:function(){
                           window.location.href = "clinica/homeAdmClinica.html"	 
                         }
                       }   
                     }	       	 
                  });

                }).error(function(data){
                  console.log(data);	
                });   
            }
    };   
});
               
// Controller que controla a seleção dos botões para indicar se queremos visualizar clínicas ou 
// pronto socorros na tabela de hospitais para selecionarmos.
app.controller("TabController",function(){
  this.tab = 1;
	    
  this.setTab = function(setTab){
    this.tab = setTab;
  };
	    
  this.isSet = function(checkTab){
    return this.tab === checkTab;
  };
});

// Controller que controla as operações e dados na HOME do administrador, que será a primeira página que ele entrará
// após a realização do login. Nessa área, ele poderá visualizar todas as clínicas e pronto socorros que ele administra
// com esse usuário e senha fornecidos no login. Poderá selecionar cada um desses hospitais e entrar em sua área
// específica para cada um deles.
app.controller("HomeAdmController",function($http,$scope,$sessionStorage){
  // Obtem o usuário logado, as clínicas e os pronto socorros que ele administra, através da $sessionStorage.
  $scope.usuario        = $sessionStorage.usuario;
  $scope.clinicas       = $sessionStorage.clinicas;
  $scope.prontoSocorros = $sessionStorage.prontoSocorros;
  
  // Método para selecionar uma determinada clínica dentre todas as clínicas que o administrador tem acesso na
  // tabela de clínicas.
  $scope.selecionarClinica = function(indice){
	// Obtém o objeto da clínica selecionada através da indexação no vetor de clínicas armazenado, com base
	// na variável indice, que é o número da linha selecionada na tabela de clínicas.
    $sessionStorage.clinica = $scope.clinicas[indice];
    
    bootbox.confirm({
      message:
    	"<span style = 'font-family:Arial;font-size:18px'> Deseja entrar em sua área da clínica "+
        $sessionStorage.clinica.nome+" ? </span>",
      buttons:{
      	cancel:{
          label : 'Não',
      	  class : 'btn-default'
        },
      	confirm:{
      	  label : 'Sim',
      	  class : 'btn-primary'
      	}
      },
      callback:function(result){
      	if (result){
      	  // Caso o administrador queira entrar na área da clínica selecionada, realizamos o método loginAdmClinica,
          // que armazena um objeto AdmClinica na própria web service de paciente, indicando uma relação entre um
      	  // administrador e uma clínica. Pesquisamos todos os convênios que essa clínica selecionada possui e 
          // migramos para a área do administrador nessa clínica.
          $http.get("http://wsadministrador.cfapps.io/loginAdmClinica/"+$sessionStorage.clinica.id).success(function(isLogado){
            $http.get("http://wsadministrador.cfapps.io/getConveniosPorClinica/"+$sessionStorage.clinica.id).success(function(convenios){
              $sessionStorage.convenios = convenios;
              window.location.href = "../Adm/clinica/homeAdmClinica.html";
            }).error(function(erro){
              console.log(erro);	
            });	  
          }).error(function(erro){
            console.log(erro);	  
          });
        }
      }
    });
  };
    
  $scope.pesquisarInstituicao = function()    
  {
    $http.get("http://wsadministrador.cfapps.io/getClinicas").success(function(clinicas){
      $sessionStorage.clinicas = clinicas;
    }).error(function(erro){
      console.log(erro);
    });
          
    $http.get("http://wsadministrador.cfapps.io/getProntoSocorros").success(function(prontoSocorros){
      $sessionStorage.prontoSocorros = prontoSocorros;
    }).error(function(erro){
      console.log(erro);  
    });
  }; 
    
  $scope.nomeInstituicao = "";
  $scope.pesquisarInstituicaoPorNome = function()
  {
    $http.get("http://wsadministrador.cfapps.io/getClinicasPorNome/"+$scope.nomeInstituicao).success(function(clinicas){
      $scope.clinicas = clinicas;
    }).error(function(erro){
      console.log(erro);
    });
          
    $http.get("http://wsadministrador.cfapps.io/getProntoSocorrosPorNome/"+$scope.nomeInstituicao).success(function(prontoSocorros){
      $scope.prontoSocorros = prontoSocorros;
    }).error(function(erro){
      console.log(erro);  
    });
  };
  
  // Método para selecionar um determinado pronto socorro dentre todos os pronto socorros que o administrador tem
  // acesso na tabela de pronto socorros.
  $scope.selecionarPs = function(indice){
	// Obtém o objeto do pronto socorro selecionado através da indexação no vetor de pronto socorros armazenado,
    // com base na variável indice, que é o número da linha selecionada na tabela de pronto socorros.
    $sessionStorage.ps = $scope.prontoSocorros[indice];	 
    
    bootbox.confirm({
      message:
        "<span style = 'font-family:Arial;font-size:18px'> Deseja entrar em sua área do pronto socorro "+
        $sessionStorage.ps.nome+" ? </span>",
      buttons:{
        cancel:{
          label : 'Não',
          class : 'btn-default'
        },
        confirm:{
          label : 'Sim',
          class : 'btn-primary'
        }
      },
      callback:function(result){
        if (result){
          // Caso o administrador queira entrar na área do pronto socorro selecionado, realizamos o método loginAdmPs,
          // que armazena um objeto AdmProntoSocorro na própria web service de paciente, indicando uma relação entre um
          // administrador e um pronto socorro. Pesquisamos todos os convênios que esse pronto socorro selecionado possui 
          // e migramos para a área do administrador nesse pronto socorro.
          $http.get("http://wsadministrador.cfapps.io/loginAdmPs/"+$sessionStorage.ps.id).success(function(isLogado){
        	$http.get("http://wsadministrador.cfapps.io/getConveniosPorPs/"+$sessionStorage.ps.id).success(function(convenios){
              $sessionStorage.convenios = convenios;
              window.location.href = "../Adm/ps/homeAdmPs.html";
            }).error(function(erro){
              console.log(erro);	
            });
          }).error(function(erro){
            console.log(erro);	  
          });  
        }
      }
    });
  };
});

// Controller para controlar os dados e as operações na área do administrador para uma determinada
// clínica selecionada na HOME de administrador. Aqui ele terá as opções para visualizar e manipular
// dados de médicos, visualizar dados de pacientes e de consultas.
app.controller("HomeAdmClinicaController",function($http,$scope,$sessionStorage){
  // Obtém o usuário logado, os dados da clínica selecionada e os convênios dessa clínica através
  // da variável de sessão $sessionStorage.
  $scope.usuario   = $sessionStorage.usuario;
  $scope.clinica   = $sessionStorage.clinica;
  $scope.convenios = $sessionStorage.convenios;
  
  // Exibe os dados da clínica selecionada.
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
  
  // Pesquisamos todos os pacientes que possuem alguma consulta na clínica selecionada e armazenamos
  // eles na variável de sessão $sessionStorage. Após isso iremos para a página de visualização de pacientes.
  $scope.exibirPacientes = function(){
    $http.get("http://wsadministrador.cfapps.io/getPacientes").success(function(pacientes){
      $sessionStorage.pacientes = pacientes;
      window.location.href = "visualizaPaciente.html";
    }).error(function(erro){
      console.log(erro);	
    });
  };
  
  // Pesquisamos todos os médicos que trabalham na clínica selecionada através da existência de registro 
  // com o id desse médico na tabela MedicoClinica. Armazenamos eles na variável de sessão $sessionStorage e
  // migramos para a página de visualização de médicos.
  $scope.exibirMedicos = function(){
	$http.get("http://wsadministrador.cfapps.io/getMedicosClinica").success(function(medicos){
	  $sessionStorage.medicos = medicos;
	  window.location.href = "visualizaMedico.html";
	}).error(function(erro){
	  console.log(erro);	
	});
  };
});

// Controller que controla os dados, as exibições e os métodos envolvendo os pacientes que possuem alguma
// consulta na clínica selecionada anteriormente.
app.controller("PacientesController",function($http,$scope,$sessionStorage){
  // Obtém os dados dos pacientes que possuem alguma consulta na clínica selecionada, da própria clínica 
  // selecionada (bem como seus convênios) e do usuário logado.
  $scope.pacientes = $sessionStorage.pacientes;
  $scope.clinica   = $sessionStorage.clinica;
  $scope.convenios = $sessionStorage.convenios;
  $scope.usuario   = $sessionStorage.usuario;
    
  // Função que retorna todos os pacientes com a parte do nome espeficiada como parâmetro.
  $scope.pesquisarPacientesPorNome = function(){
    var nome = $("#txtPaciente").val();
    
    $http.get("http://wsadministrador.cfapps.io/getPacientesPorNome/"+nome).success(function(pacientes){
      $scope.pacientes = pacientes;
    }).error(function(erro){
      console.log(erro);    
    });
  };
  
  // Exibe os dados da clínica selecionada.
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
  // Objeto do paciente que será selecionado na tabela de pacientes.
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
  // Teremos uma área para visualizar cada paciente selecionado na tabela de pacientes. Alguns campos dessa
  // área fazem referência aos atributos do objeto de paciente por meio da notação ng-model do ângular. 
  // Essa área inicialmente está inativa, com style = 'display:none', pois só será exibida após a seleção 
  // de um registro na tabela de pacientes. Nesse estado, esses campos mencionados anteriormente fazem 
  // referência aos atributos vazios do objeto acima declarado, pois ainda não selecionamos nenhum paciente.
  // Ao selecionar um registro na tabela, ao invés de fazer $scope.paciente = (Objeto obtido a partir da seleção
  // do paciente na tabela), devemos setar cada atributo de $scope.paciente para que ng-model faça a referência 
  // corretamente após mudarmos os dados desses campos.
  $scope.setPaciente = function(paciente){
    $scope.paciente.id             = paciente.id;
    $scope.paciente.nome           = paciente.nome;
    $scope.paciente.cpf            = paciente.cpf;
    $scope.paciente.telefone       = paciente.telefone;
    $scope.paciente.celular        = paciente.celular;
    $scope.paciente.cep            = paciente.cep;
    $scope.paciente.bairro         = paciente.bairro;
    $scope.paciente.complemento    = paciente.complemento;
    $scope.paciente.senha          = paciente.senha;
    $scope.paciente.cidade         = paciente.cidade;
    $scope.paciente.uf             = paciente.uf;
    $scope.paciente.endereco       = paciente.endereco;
    $scope.paciente.dataNascimento = paciente.dataNascimento;
  };
 
  // Da mesma maneira que fizemos com o paciente selecionado, faremos com o médico selecionado.
  // (O processo de seleção de médico será detalhado mais adiante)
  $scope.medico = {
    id   : 0,
    uf   : "",
    crm  : "",
    nome : ""
  };
  $scope.setMedico = function(medico){
   if (medico != null){
    $scope.medico.id   = medico.id;
    $scope.medico.uf   = medico.uf;
    $scope.medico.crm  = medico.crm;
    $scope.medico.nome = medico.nome;
   }
  };
  // Da mesma maneira que fizemos com o paciente selecionado e com o médico selecionado, faremos
  // com os médicos pesquisados. (O processo de pesquisa de médicos será detalhado mais adiante)
  $scope.medicos = [
    {
      id   : 0,
      uf   : "",
      crm  : "",
      nome : ""
    }
  ];
  $scope.setMedicos = function(medicos){
    if (medicos.length > 0){
      if (medicos.length > 1)
        $scope.medicos.splice(1,$scope.medicos.length-1);
      $scope.medicos[0].id   = medicos[0].id;
      $scope.medicos[0].uf   = medicos[0].uf;
      $scope.medicos[0].crm  = medicos[0].crm;
      $scope.medicos[0].nome = medicos[0].nome;
      for (i = 1; i < medicos.length; i++){
        var medico = {
          id   : medicos[i].id,
          uf   : medicos[i].uf,
          crm  : medicos[i].crm,
          nome : medicos[i].nome
        };
        $scope.medicos.push(medico);
      }
    }  
  };
  
  // Exibimos os dados do paciente selecionado na tabela(nome,cpf,data de nascimento,cidade,endereço,
  // telefone e celular) e a opção para visualizar suas consultas.
  $scope.exibirDadosPaciente = function(){
    var box = bootbox.dialog({
	  title:"<center><span style = 'font-size:20px;'>"+$scope.paciente.nome+"</span></center>",
	  message:$("#dadosPaciente").html(),
	  buttons:{
	    btnVoltar:{
	  	  label:"Voltar",
	  	  class:"btn-default"
	    },
	    btnVisualizarConsultas:{
	  	  label:"Visualizar consultas",
	  	  class:"btn-primary",
	  	  callback:function(){
	  	    bootbox.dialog({
	  	      title:"<center><span style = 'font-size:20px;'>"+$scope.paciente.nome+"</span></center>",
	  	      message:function(){
	  	      // Todas as consultas desse paciente nessa clínica serão exibidas, a partir de um determinado médico.
	  	      // Assim o administrador pesquisa todas as consultas do paciente selecionado, na clínica selecionada, 
	  	      // com determinado médico. Há ainda a opção para pesquisar essas consultas por data.
	  	      var mensagem = 
	  	      "<script>"+
	  	       "function pesquisarConsulta(){"+
	  	         "var data = $('#txtData').val();"+
	  	         "var parametros = $('#btnMedico').val()+'/'+data;"+
	  	         "$.ajax({"+
	      	       "url:'http://wsadministrador.cfapps.io/getConsultasPorPacienteMedicoData/'+parametros,"+
	      	       "data:{format:'json'},"+
	      	       "error:function(erro){console.log(erro);},"+
	      	       "success:function(consultas){"+
	      	         "preencherTabela(consultas);"+
	      	       "}"+
	  	         "});"+
	  	       "}"+
	  	       "function preencherTabela(consultas){"+
	  	         "var tabela = $('#tblConsultas');"+
     	         "$('#tblConsultas tbody tr').remove();"+
     	         "consulta = null;"+
     	         "for (var i = 1; i <= consultas.length; i++){"+
     	            "consulta       = consultas[i-1];"+
     	            "var data       = consulta.horario.data;"+
     	            "var horaInicio = consulta.horario.horaInicio;"+
     	            "var horaFim    = consulta.horario.horaFim;"+
     	    
     	            "var linha = "+
 	                "\"<tr class = 'row'>\"+"+
 	                  "\"<td>\"+data.substring(8,10)+\"/\"+data.substring(5,7)+\"/\"+data.substring(0,4)+\"</td>\"+"+
 	                  "\"<td>\"+horaInicio+\"</td>\"+"+
 	                  "\"<td>\"+horaFim+\"</td>\"+"+
 	                "\"</tr>\";"+
 	                "tabela.append(linha);"+
     	         "}"+
	  	       "}"+
	           "function selecionarMedico(parametros){"+
	            "$('#btnMedico').val(parametros);"+
	            "$.ajax({"+
	      	     "url:'http://wsadministrador.cfapps.io/getConsultasPorPacienteMedico/'+parametros,"+
	      	     "data:{format:'json'},"+
	      	     "error:function(erro){console.log(erro);},"+
	      	     "success:function(consultas){"+
	      	       "preencherTabela(consultas);"+
	      	       "var nomeMedico = consulta.horario.medico.nome;"+
	      	       "var crmMedico  = consulta.horario.medico.crm;"+
	      	       "$('#btnMedico').text(nomeMedico+', CRM: '+crmMedico);"+
	      	      "}"+
	             "});"+
	            "}"+
	           "</script>"+
	           "<style>"+
	            ".tabelaConsulta{"+
	              "display:block;"+
	              "overflow-y:auto;"+
	              "font-family:Arial;"+
	              "font-size:15px;"+
	              "text-align:center;"+
	              "height : 300px;"+
	              "width  : 568px;"+
	            "}"+
	            ".titulo"+
	            "{"+  
	              "color:#003074;"+
	              "font-size:19px;"+
	            "}"+
	            ".listaMedicos{"+
	              "position:absolute;"+
	              "max-height:350px;"+
	              "overflow-y:auto;"+
	              "overflow-x:hidden;"+
	            "}"+
	            "ul"+
	            "{"+
	              "list-style:none;"+
	            "}"+
	            ".elemento a"+
	            "{"+
	              "font-size: 15px;"+
	            "}"+
	            ".elemento a:hover"+
	            "{"+
	              "text-decoration: none;"+
	            "}"+
	            ".dropdown{"+
	              "left:0px;"+
	              "top:0px;"+
	              "width:568px;"+
	            "}"+
	            ".campoData{"+
	              "width:262px;"+
	            "}"+
	           "</style>"+
	           "<div class='form-group'>"+  
	             "<label class = 'titulo'>Médico</label><br>"+              
	             "<div class='dropdown'>"+ 
	               "<button class = 'btn btn-default dropdown-toggle' data-toggle = 'dropdown' id = 'btnMedico'>"+
	                  "<span class = 'caret'></span>"+
	               "</button>"+
	               "<ul class='dropdown-menu listaMedicos'>";
	  	    
	  	        for (var i = 0; i < $scope.medicos.length; i++){
	  	          var medico = $scope.medicos[i];
	  	          mensagem +=
	                "<li id           = '"+$scope.paciente.id+"/"+medico.id+"'"+
	                     "onmouseover = \"this.style.cursor = 'pointer';\""+
	                     "onclick     = 'selecionarMedico(this.id)'"+
	                     "class       = 'elemento'>"+
	                    "<div style = 'margin-left:5%;width:568px;'>"+
	                     "<a href = '#'>"+
	                        medico.nome+", CRM: "+medico.crm+
	                     "</a>"+
	                    "</div>"+
	                "</li>";
	  	        }
	  	        mensagem +=
	               "</ul>"+
	              "</div>"+                        
	            "</div>"+
	            "<div class='form-group'>"+
	             "<label class = 'titulo'>Consultas</label>"+
	             "<input type = 'date' class = 'form-control campoData' id = 'txtData' onchange = 'pesquisarConsulta()'><br>"+
	             "<div class = 'tabelaConsulta'>"+
	               "<table class='table table-hover table-responsive' id = 'tblConsultas'>"+
	                 "<thead>"+
	                   "<tr class = 'row'>"+
	                     "<th class = 'col-sm-4'><center>Data</center></th>"+
	                     "<th class = 'col-sm-4'><center>Horário de início</center></th>"+
	                     "<th class = 'col-sm-4'><center>Horário de término</center></th>"+
	                   "</tr>"+
	                 "</thead>"+
	                 "<tbody>"+
	                 "</tbody>"+
	               "</table>"+
	             "</div>"+
	            "</div>"+
	            "<script>"+
	              "selecionarMedico('"+$scope.paciente.id+"/"+$scope.medicos[0].id+"');"+ 
	            "</script>";
	            
	            return mensagem;
	  	      },
	  	      buttons:{
	  	        btnVoltar:{
	  	          label:"Voltar",
	  	          class:"btn-default",
	  	          callback:function(){
	  	            $scope.exibirDadosPaciente();	  
	  	          }
	  	        },
	  	        btnFechar:{
	  	          label:"Fechar",
	  	          class:"btn-primary"
	  	        }
	  	      }
	  	   }).find('.modal-content').css({
	  		 'height':'645px',
	  		 'top':'30px'
	  	   }).find('.modal-body').css({
	  		 'height':'480px'	
	  	   });
	  	  }
	    }
	  }
    });
  };
  
  // Método que realiza as operações após a seleção de um paciente na tabela de pacientes
  $scope.selecionarPaciente = function(indice){
	// Obtém o objeto do paciente selecionado, a partir da indexação no vetor de pacientes armazenado,
	// com base na variável indice, que é o número da linha selecionada na tabela de pacientes.
  	$scope.setPaciente($scope.pacientes[indice]);
  	$sessionStorage.paciente = $scope.paciente;
  	// Pesquisamos todos os médicos com os quais o paciente selecionado possui alguma consulta.
  	$http.get("http://wsadministrador.cfapps.io/getMedicosPorPaciente/"+$scope.paciente.id).success(function(medicos){
      $scope.setMedicos(medicos);
      $scope.setMedico(medicos[0]);
      $scope.exibirDadosPaciente();
  	}).error(function(erro){
  	  console.log(erro);	
  	});
  };
});

//Controller que controla os dados, as exibições e os métodos envolvendo os médicos que trabalham
//na clínica selecionada anteriormente.
app.controller("MedicoClinicaController",function($http,$scope,$sessionStorage){
  // Obtém os dados da clínica selecionada anteriormente (bem como seus convênios), dos médicos que trabalham
  // nessa clínica e do usuário logado, através da variável de sessão $sessionStorage.
  $scope.medicos   = $sessionStorage.medicos;
  $scope.clinica   = $sessionStorage.clinica;
  $scope.convenios = $sessionStorage.convenios;
  $scope.usuario   = $sessionStorage.usuario; 
    
  $scope.nomeMedico = "";
  $scope.pesquisarMedicosPorNome = function(){
    $http.get("http://wsadministrador.cfapps.io/getMedicosClinicaPorNome/"+$scope.nomeMedico).success(function(medicos){
      $scope.medicos = medicos;
    }).error(function(erro){
      console.log(erro);  
    });  
  };
            	  
  // Método para exibir os dados da clínica selecionada anteriormente.
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
  
  // Objeto do médico que será selecionado na tabela de médicos.
  $scope.medico = {
    id   : 0,
    uf   : "",
    crm  : "",
    nome : ""
  };
  // Teremos uma área para visualizar cada médico selecionado na tabela de médicos. Alguns campos dessa
  // área fazem referência aos atributos do objeto de médico por meio da notação ng-model do ângular. 
  // Essa área inicialmente está inativa, com style = 'display:none', pois só será exibida após a seleção 
  // de um registro na tabela de médicos. Nesse estado, esses campos mencionados anteriormente fazem 
  // referência aos atributos vazios do objeto acima declarado, pois ainda não selecionamos nenhum médico.
  // Ao selecionar um registro na tabela, ao invés de fazer $scope.medico = (Objeto obtido a partir da seleção
  // do médico na tabela), devemos setar cada atributo de $scope.medico para que ng-model faça a referência 
  // corretamente após mudarmos os dados desses campos.
  $scope.setMedico = function(medico){
    $scope.medico.id   = medico.id;
    $scope.medico.uf   = medico.uf;
    $scope.medico.crm  = medico.crm;
    $scope.medico.nome = medico.nome;
  };
  
  // Do mesmo modo que na seleção de médicos anteriormente, devemos fazer também para as especialidades
  // desse médico.
  $scope.especialidadesMedico = [
    {
      id   : 0,
      nome : ""
    }                             
  ];
  $scope.setEspecialidades = function(especialidades){
    $scope.especialidadesMedico.splice(0,$scope.especialidadesMedico.length-1);
    if (especialidades.length > 0)
      for (i = 0; i < especialidades.length; i++){
        var especialidade = {
    	  id   : especialidades[i].id,
    	  nome : especialidades[i].nome
    	};
    	$scope.especialidadesMedico.push(especialidade);
      }
  };
  
  // Método que trata a visualização e pesquisa dos horários do médico selecionado.
  $scope.visualizarHorarios = function(){
      bootbox.dialog({
	    title:	
		  "<center>"+
		    "<div class = 'form-group'>"+
			  "<h3><span>"+$scope.medico.nome+"</span></h3>"+
			  "<h5><span>CRM: "+$scope.medico.crm+"("+$scope.medico.uf+")</span></h5>"+
			"</div>"+
		  "</center>",
	    buttons:{
		  btnVoltar:{
		    label:"Voltar",
			class:"btn-default",
			callback:function(){
			  $scope.visualizarDadosMedico();
			}
		  },
	      btnFechar:{
		    label:"Fechar",
			class:"btn-primary"
		  }
		},
		message:function(){
		 // Os horários que o médico selecionado trabalha nessa clínica são exibidos em uma tabela. Podemos
		 // também pesquisá-los por data.
	     var mensagem =
		  "<style>"+
			".tabelaHorario{"+
	          "display: block;"+
	          "overflow-y: auto;"+
	          "position: relative;"+ 
	          "font-family: Arial;"+
	          "font-size: 15px;"+
	          "text-align:center;"+
	          "height:300px;"+
	        "}"+
			".campoData{"+
              "width:262px;"+
            "}"+
			".titulo{"+
              "color:#003074;"+
              "font-size:19px;"+
            "}"+
		  "</style>"+
		  "<script>"+
		    "function pesquisarHorario(){"+
		     "var data = $('#txtData').val();"+
             "$.ajax({"+
	           "url:'http://wsadministrador.cfapps.io/getHorariosPorMedicoData/'+'"+$scope.medico.id+"'+'/'+data,"+
	           "data:{format:'json'},"+
	           "error:function(erro){console.log(erro);},"+
	           "success:function(horarios){"+
	             "preencherTabela(horarios);"+
	           "}"+
             "});"+
            "}"+ 
		    "function exibirHorario(){"+
			 "$.ajax({"+
			  "url:'http://wsadministrador.cfapps.io/getHorariosPorMedico/"+$scope.medico.id+"',"+
			  "data:{format:'json'},"+
			  "error:function(erro){console.log(erro);},"+
			  "success:function(horarios){"+
			    "preencherTabela(horarios);"+
			  "}"+
		     "});"+
		    "}"+
		    "function preencherTabela(horarios){"+
  	            "var tabela = $('#tblHorarios');"+
  	            "$('#tblHorarios tbody tr').remove();"+
	            "for (var i = 1; i <= horarios.length; i++){"+
	              "var horario    = horarios[i-1];"+
	              "var data       = horario.data;"+
	              "var horaInicio = horario.horaInicio;"+
	              "var horaFim    = horario.horaFim;"+
	    
	              "var linha = "+
	              "\"<tr class = 'row'>\"+"+
	                "\"<td>\"+data.substring(8,10)+\"/\"+data.substring(5,7)+\"/\"+data.substring(0,4)+\"</td>\"+"+
	                "\"<td>\"+horaInicio+\"</td>\"+"+
	                "\"<td>\"+horaFim+\"</td>\"+"+
	              "\"</tr>\";"+
	              "tabela.append(linha);"+
	            "}"+
  	        "}"+
		   "</script>"+
		   "<div class = 'form-group'>"+
            "<label class = 'titulo'>Horários</label>"+
            "<input type = 'date' class = 'form-control campoData' id = 'txtData' onchange = 'pesquisarHorario()'><br>"+
            "<div class='tabelaHorario'>"+
             "<table class='table table-hover table-responsive' id = 'tblHorarios'>"+
               "<thead>"+
                 "<tr class = 'row'>"+
                   "<th class = 'col-sm-4'><center>Data</center></th>"+
                   "<th class = 'col-sm-4'><center>Horário de início</center></th>"+
                   "<th class = 'col-sm-4'><center>Horário de término</center></th>"+
                 "</tr>"+
               "</thead>"+
               "<tbody>"+
               "</tbody>"+      
             "</table>"+
            "</div>"+
          "</div>"+   
          "<script>"+
            "exibirHorario();"+ 
          "</script>";
	     return mensagem;
		}
      });
  };
  
  // Método para visualizar os dados do médico selecionado: nome, CRM e especialidades em que atua,
  // além de fornecer as opções para excluir o médico da determinada clínica, alterar os seus dados,
  // visualizar e pesquisar os horários desse médico nessa determinada clínica ou visualizar e pesquisar as 
  // consultas desse médico nessa determinada clínica, com base num paciente selecionado.
  $scope.visualizarDadosMedico = function(){
    bootbox.dialog({
	  title:
	    "<center>"+
	  	  "<div class = 'form-group'>"+
	  	    "<h3><span>"+$scope.medico.nome+"</span></h3>"+
	  	    "<h5><span>CRM: "+$scope.medico.crm+"("+$scope.medico.uf+")</span></h5>"+
	  	  "</div>"+
	  	"</center>", 	 
	  message:$("#dadosMedico").html(),
	  buttons:{
	    btnExcluir:{
	      label:"Excluir da clínica",
	  	  class:"btn-primary"
	  	},
	  	btnAlterar:{
	  	  label:"Alterar dados",
	  	  class:"btn-primary"
	  	},
	  	btnHorarios:{
	  	  label:"Visualizar horários",
	  	  class:"btn-primary",
	  	  callback:function(){
	  	    $scope.visualizarHorarios();	
	  	  }
	  	},
	  	btnConsultas:{
	  	  label:"Visualizar consultas",
	  	  class:"btn-primary",
	  	  callback:function(){
	  	    $scope.visualizarConsultas();	
	  	  }
	 	}
	  }
	}).find('.modal-content').css({
      'max-height':'500px',
      'overflow-y':'auto'
    }).scrollTop = 0;  
  };
  
  // Método para visualizar e pesquisar as consultas do médico determinado na clínica determinada 
  // e com o paciente que será selecionado. As consultas também poderão ser pesquisadas por data.
  $scope.visualizarConsultas = function(){
    bootbox.dialog({
      title:"<center><span style = 'font-size:20px;'>"+$scope.medico.nome+"</span></center>",
      message:function(){
    	  var mensagem = 
	  	      "<script>"+
	  	       "function pesquisarConsulta(){"+
 	            "var data = $('#txtData').val();"+
 	            "var parametros = $('#btnPaciente').val()+'/'+data;"+
 	            "$.ajax({"+
     	         "url:'http://wsadministrador.cfapps.io/getConsultasPorPacienteMedicoData/'+parametros,"+
     	         "data:{format:'json'},"+
     	         "error:function(erro){console.log(erro);},"+
     	         "success:function(consultas){"+
     	           "preencherTabela(consultas);"+
     	         "}"+
 	            "});"+
 	           "}"+
 	          "function preencherTabela(consultas){"+
	  	        "var tabela = $('#tblConsultas');"+
  	            "$('#tblConsultas tbody tr').remove();"+
  	            "consulta = null;"+
  	            "for (var i = 1; i <= consultas.length; i++){"+
  	              "consulta       = consultas[i-1];"+
  	              "var data       = consulta.horario.data;"+
  	              "var horaInicio = consulta.horario.horaInicio;"+
  	              "var horaFim    = consulta.horario.horaFim;"+
  	    
  	              "var linha = "+
	              "\"<tr class = 'row'>\"+"+
	                "\"<td>\"+data.substring(8,10)+\"/\"+data.substring(5,7)+\"/\"+data.substring(0,4)+\"</td>\"+"+
	                "\"<td>\"+horaInicio+\"</td>\"+"+
	                "\"<td>\"+horaFim+\"</td>\"+"+
	              "\"</tr>\";"+
	              "tabela.append(linha);"+
  	            "}"+
	  	       "}"+
	           "function selecionarPaciente(parametros){"+
	            "$('#btnPaciente').val(parametros);"+
	            "$.ajax({"+
	      	     "url:'http://wsadministrador.cfapps.io/getConsultasPorPacienteMedico/'+parametros,"+
	      	     "data:{format:'json'},"+
	      	     "error:function(erro){console.log(erro);},"+
	      	     "success:function(consultas){"+
	      	       "preencherTabela(consultas);"+
	      	       "var nomePaciente = consulta.paciente.nome;"+
	      	       "var cpfPaciente  = "+
	      	         "consulta.paciente.cpf.substring(0,3)+'.'+"+
                     "consulta.paciente.cpf.substring(3,6)+'.'+"+
                     "consulta.paciente.cpf.substring(6,9)+'-'+"+
                     "consulta.paciente.cpf.substring(9,11);"+
	      	       "$('#btnPaciente').text(nomePaciente+', CPF: '+cpfPaciente);"+
	      	      "}"+
	             "});"+
	            "}"+
	           "</script>"+
	           "<style>"+
	            ".tabelaConsulta{"+
	              "display:block;"+
	              "overflow-y:auto;"+
	              "font-family:Arial;"+
	              "font-size:15px;"+
	              "text-align:center;"+
	              "height : 300px;"+
	              "width  : 568px;"+
	            "}"+
	            ".form-content{"+
	             "position:relative;"+
	             "height:100%;"+
	             "top:0%;"+
	            "}"+
	            ".titulo"+
	            "{"+  
	              "color:#003074;"+
	              "font-size:19px;"+
	            "}"+
	            ".listaPacientes{"+
	              "position:absolute;"+
	              "max-height:350px;"+
	              "overflow-y:auto;"+
	              "overflow-x:hidden;"+
	            "}"+
	            "ul"+
	            "{"+
	              "list-style:none;"+
	            "}"+
	            ".elemento a"+
	            "{"+
	              "font-size: 15px;"+
	            "}"+
	            ".elemento a:hover"+
	            "{"+
	              "text-decoration: none;"+
	            "}"+
	            ".dropdown{"+
	              "position:relative;"+
	              "left:0%;"+
	              "top:0%;"+
	              "width:568px;"+
	            "}"+
	            ".campoData{"+
	              "width:262px;"+
	            "}"+
	           "</style>"+
	           "<div class='form-content'>"+
	           "<div class='form-group'>"+  
	             "<label class = 'titulo'>Paciente</label><br>"+              
	             "<div class='dropdown'>"+ 
	               "<button class = 'btn btn-default dropdown-toggle' data-toggle = 'dropdown' id = 'btnPaciente'>"+
	                  "<span class = 'caret'></span>"+
	               "</button>"+
	               "<ul class='dropdown-menu listaPacientes'>";
	  	    
	  	        for (var i = 0; i < $scope.pacientes.length; i++){
	  	          var paciente = $scope.pacientes[i];
	  	          mensagem +=
	                "<li id           = '"+paciente.id+"/"+$scope.medico.id+"'"+
	                     "onmouseover = \"this.style.cursor = 'pointer';\""+
	                     "onclick     = 'selecionarPaciente(this.id)'"+
	                     "class       = 'elemento'>"+
	                    "<div style = 'margin-left:5%;width:568px;'>"+
	                     "<a href = '#'>"+
	                        paciente.nome+", CPF: "+
	                        paciente.cpf.substring(0,3)+"."+
	                        paciente.cpf.substring(3,6)+"."+
	                        paciente.cpf.substring(6,9)+"-"+
	                        paciente.cpf.substring(9,11)+
	                     "</a>"+
	                    "</div>"+
	                "</li>";
	  	        }
	  	        mensagem +=
	               "</ul>"+
	              "</div>"+                        
	            "</div>"+
	            "<div class='form-group'>"+
	             "<label class = 'titulo'>Consultas</label>"+
	             "<input type = 'date' class = 'form-control campoData' id = 'txtData' onchange = 'pesquisarConsulta()'><br>"+
	             "<div class = 'tabelaConsulta'>"+
	               "<table class='table table-hover table-responsive' id = 'tblConsultas'>"+
	                 "<thead>"+
	                   "<tr class = 'row'>"+
	                     "<th class = 'col-sm-4'><center>Data</center></th>"+
	                     "<th class = 'col-sm-4'><center>Horário de início</center></th>"+
	                     "<th class = 'col-sm-4'><center>Horário de término</center></th>"+
	                   "</tr>"+
	                 "</thead>"+
	                 "<tbody>"+
	                 "</tbody>"+
	               "</table>"+
	             "</div>"+
	            "</div>"+
	            "</div>"+
	            "<script>"+
	              "selecionarPaciente('"+$scope.pacientes[0].id+"/"+$scope.medico.id+"');"+ 
	            "</script>";
	            
	            return mensagem;
      },
      buttons:{
    	btnVoltar:{
    	  label:"Voltar",
    	  class:"btn-default",
    	  callback:function(){
    		$scope.visualizarDadosMedico();
    	  }
    	},
    	btnFechar:{
    	  label:"Fechar",
    	  class:"btn-primary"
    	}
      }
    }).find('.modal-content').css({
 	  'height':'645px',
 	  'top':'30px'
 	}).find('.modal-body').css({
 	  'height':'480px'	
 	});
  };
  
  // Trata os dados e operações necessárias após selecionar um determinado médico dentre todos os médicos
  // exibidos na tabela de médicos que trabalham na clínica determinada.
  $scope.selecionarMedico = function(indice){
	// Obtém o objeto do médico selecionado, a partir da indexação no vetor de médicos armazenado, com base
	// na variável indice, que é o número da linha selecionada na tabela de médicos.
    var medico = $scope.medicos[indice];
    $scope.setMedico(medico);
    
    // Pesquisamos todas as especialidades desse médico selecionado.
    $http.get("http://wsadministrador.cfapps.io/getEspecialidades/"+medico.id).success(function(especialidades){
      $scope.setEspecialidades(especialidades);
      // Pesquisamos todos os pacientes que possuem alguma consulta com esse médico selecionado na clínica determinada.
      $http.get("http://wsadministrador.cfapps.io/getPacientesPorMedico/"+medico.id).success(function(pacientes){
    	$scope.pacientes = pacientes;
    	$scope.visualizarDadosMedico();
      }).error(function(erro){
        console.log(erro);	  
      });
    }).error(function(erro){
      console.log(erro);	
    });
  };
});

//Controller que controla os dados, as exibições e os métodos envolvendo os médicos que trabalham
//no pronto socorro selecionado anteriormente.
app.controller("MedicoPsController",function($http,$scope,$sessionStorage){
  // Obtém os dados do pronto socorro selecionado anteriormente (bem como seus convênios), 
  // todos os médicos que trabalham nesse pronto socorro e os médicos que estão em plantão
  // no momento nesse pronto socorro (com base na existência de registros na tabela MedicoPs)
  $scope.medicos        = $sessionStorage.medicos;
  $scope.medicosPlantao = $sessionStorage.medicosPlantao;
  $scope.ps             = $sessionStorage.ps;
  $scope.convenios      = $sessionStorage.convenios;
    
  $scope.nomeMedico = "";
  $scope.pesquisarMedicosPorNome = function(){
    $http.get("http://wsadministrador.cfapps.io/getMedicosPsPorNome/"+$scope.nomeMedico).success(function(medicos){
      $scope.medicos = medicos;
      $scope.medicosPlantao = medicos;
    }).error(function(erro){
      console.log(erro);  
    });  
  };
  
  // Exibimos os dados do pronto socorro selecionado anteriormente.
  $scope.exibirDadosPs = function(){
    bootbox.alert({
      title:"<h3><center><span>"+$scope.ps.nome+"</span></center></h3>",
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
  
  // Objeto com os dados do médico selecionado na tabela de médicos.
  $scope.medico = {
    id   : 0, 
    uf   : "",
	crm  : "",
    nome : ""
  };
  // Teremos uma área para visualizar cada médico selecionado na tabela de médicos. Alguns campos dessa
  // área fazem referência aos atributos do objeto de médico por meio da notação ng-model do ângular. 
  // Essa área inicialmente está inativa, com style = 'display:none', pois só será exibida após a seleção 
  // de um registro na tabela de médicos. Nesse estado, esses campos mencionados anteriormente fazem 
  // referência aos atributos vazios do objeto acima declarado, pois ainda não selecionamos nenhum médico.
  // Ao selecionar um registro na tabela, ao invés de fazer $scope.medico = (Objeto obtido a partir da seleção
  // do médico na tabela), devemos setar cada atributo de $scope.medico para que ng-model faça a referência 
  // corretamente após mudarmos os dados desses campos.
  $scope.setMedico = function(medico){
	$scope.medico.id   = medico.id;
    $scope.medico.uf   = medico.uf;
    $scope.medico.crm  = medico.crm;
    $scope.medico.nome = medico.nome;
  };
  // Fazemos o mesmo com as especialidades desse médico.
  $scope.especialidadesMedico = [
    {
      id   : 0,
      nome : ""
    }                             
  ];
  $scope.setEspecialidades = function(especialidades){
    $scope.especialidadesMedico.splice(0,$scope.especialidadesMedico.length-1);
    if (especialidades.length > 0)
      for (i = 0; i < especialidades.length; i++){
        var especialidade = {
          id   : especialidades[i].id,
          nome : especialidades[i].nome
        };
        $scope.especialidadesMedico.push(especialidade);
      }
  };
 
  // Método que trata os dados e processos ao selecionar um determinado médico na tabela de médicos.
  $scope.selecionarMedico = function(indice){
	// Obtém o objeto do médico selecionado a partir da indexação no vetor de médicos armazenado,
	// com base na variável indice, que é o número da linha selecionada na tabela de médicos.
    var medico = $scope.medicos[indice];
    $scope.setMedico(medico);
    
    // Pesquisamos todas as especialidades do médico selecionado.
    $http.get("http://wsadministrador.cfapps.io/getEspecialidades/"+medico.id).success(function(especialidades){
      $scope.setEspecialidades(especialidades);
      
      // Verificamos se o médico selecionado está em plantão no momento ou não.
      $http.get("http://wsadministrador.cfapps.io/isMedicoPresente/"+medico.id).success(function(isMedicoPresente){
    	$scope.isPresente = isMedicoPresente;  
      }).error(function(erro){
        console.log(erro);	  
      });
      
      // Exibimos os dados dos médicos que trabalham no pronto socorro selecionado. Haverá duas opções:
      // visualizar todos os médicos e visualizar os médicos que estão em plantão.
      bootbox.dialog({
    	title:
    	  "<center>"+
    	    "<div class = 'form-group'>"+
    	      "<h3><span>"+$scope.medico.nome+"</span></h3>"+
    	      "<h5><span>CRM: "+$scope.medico.crm+"("+$scope.medico.uf+")</span></h5>"+
    	    "</div>"+
    	  "</center>", 
    	message:$("#dadosMedico").html(),
    	buttons:{
    	  btnVoltar:{
    		label:"Voltar",
    		class:"btn-primary"
    	  }	
        }
      });
    }).error(function(erro){
      console.log(erro);	
    });
  };
});

//Controller para controlar os dados e as operações na área do administrador para um determinado
//pronto socorro selecionado na HOME de administrador. Aqui ele terá as opções para visualizar e
//pesquisar por médicos que trabalham nesse pronto socorro e os que estão em plantão.
app.controller("HomeAdmPsController",function($http,$scope,$sessionStorage){
  // Obtém os dados do pronto socorro selecionado (bem como seus convênios) e o usuário logado,
  // a partir da variável de sessão $sessionStorage.
  $scope.usuario   = $sessionStorage.usuario;
  $scope.ps        = $sessionStorage.ps;
  $scope.convenios = $sessionStorage.convenios;
  
  // Exibimos os dados do pronto socorro selecionado.
  $scope.exibirDadosPs = function(){
    bootbox.alert({
	  title:"<h3><center><span>"+$scope.ps.nome+"</span></center></h3>",
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
  
  // Método que trata a exibição dos médicos que trabalham no pronto socorro selecionado.
  $scope.exibirMedicos = function(){
	// Pesquisamos todos os médicos que trabalham em determinado pronto socorro e armazenamos
	// eles na variável de sessão $sessionStorage.
    $http.get("http://wsadministrador.cfapps.io/getMedicosPs").success(function(medicos){
      $sessionStorage.medicos = medicos;
      // Pesquisamos todos os médicos que estão em plantão em determinado pronto socorro e 
      // armazenamos eles na variável de sessão $sessionStorage. Após isso, migramos para
      // a área de visualização de médicos do administrador.
      $http.get("http://wsadministrador.cfapps.io/getMedicosPlantao").success(function(medicosPlantao){
        $sessionStorage.medicosPlantao = medicosPlantao;
        window.location.href = "visualizaMedico.html";
      }).error(function(erro){
    	console.log(erro);
      });
    }).error(function(erro){
	  console.log(erro);	
	});
  };
});

})();
