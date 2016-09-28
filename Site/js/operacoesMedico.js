(function(){

// Inicia um módulo para uma aplicação Angular e utiliza as configurações
// do ngStorage (entre colchetes), o qual será responsável pela existência
// da variável de sessão SessionStorage.
var app = angular.module("operacoesMedico",["ngStorage"]);

// Controller para a realização da conexão com o banco de dados remoto do PIVOTAL,
// através do método conectarBd do Web Service de médicos, também no PITOVAL.
app.controller("ConexaoBdController",function($http,$scope){
   this.conectarBd = function(){
	 // Se a conexão for realizada, isConectado = true, caso contrário, isConectado = false.
     $http.get("http://wsmedico.cfapps.io/conectarBd").success(function(data){
	    $scope.isConectado = data;
     }).error(function(erro){
        console.log(erro);	 
     });
   };
});

// Controller para a realização do login de médico.
app.controller("LoginMedicoController",function($http,$scope,$sessionStorage){
   // Objeto com os dados necessários para a realização do login de médico. Ao preencher esses
   // dados no formulário de login, os atributos do objeto serão atualizados automaticamente.
   this.medico = {
     crm:'',
     senha:''
   };
  
   var loginMedico = this.medico;
   this.loginMedico = function(){
	 // Primeiramente, verificamos se existe algum médico trabalhando em alguma clínica com esse CRM e 
	 // essa senha, ou seja, caso exista algum registro na tabela MedicoClinica tal que a senha seja 
	 // a mesma que a digitada no formulário de login e o idMedico corresponda ao id de um médico com
	 // o mesmo CRM digitado no formulário de login.
     $http.post("http://wsmedico.cfapps.io/isMedicoClinica",loginMedico).success(function(data){
    	 // Após a realização do método isMedicoClinica, na própria Web Service de médicos, os dados do
    	 // médico são armazenados em um objeto.
	     $scope.isMedicoExistente = data;
	     // Caso exista algum médico nessas condições, obtemos todos os seus dados e armazenamos eles
	     // na variável de sessão $sessionStorage. Armazenamos também os dados do seu login para a sua 
	     // utilização em outros métodos posteriormente.
	     if ($scope.isMedicoExistente){
	       $http.get("http://wsmedico.cfapps.io/getMedico").success(function(data){
	    	 $sessionStorage.medico = data;
	    	 $sessionStorage.loginMedico = loginMedico;
	    	 // Posteriormente, pesquisaremos todas as clínicas relacionadas à esse médico. Como as clínicas
	    	 // não sofrerão de atualizações constantes no banco de dados, pesquisados elas apenas uma vez como
	    	 // forma de economizarmos tempo de execução. Pesquisamos apenas quando o usuário passa da tela 
	    	 // de login para a tela de exibição de clínicas. Após isso, as clínicas estarão armazenadas na 
	    	 // variável de sessão $sessionStorage. Caso o usuário esteja na página de exibição de clínicas,
	    	 // mude para outra página e depois volte para a página de exibição de clínicas, por exemplo, as 
	    	 // clínicas não serão pesquisadas novamente no banco de dados, mas sim obtidas do $sessionStorage.
	    	 $sessionStorage.isClinicaJaPesquisada = false;
	       });
	       // Pesquisamos todas as especialidades nas quais esse determinado médico atua.
	       $http.get("http://wsmedico.cfapps.io/getEspecialidades").success(function(data){
	    	 $sessionStorage.especialidades = data;
	    	 window.location.href = "homeMedico.html";
	       });
	     }
	     else
	       // Caso o CRM e a senha digitados não correspondam aos dados de nenhum médico, exibimos a mensagem abaixo.
	       bootbox.dialog({
	    	 message: 'O CRM e a senha que você digitou não coincidem.',
	    	 buttons:{btnVoltar:{label:"Voltar",class:"btn-pimary"}}
	       });
	 });
   };
});

// Após verificarmos que existe um médico com o CRM e a senha digitados no login, iremos para a HOME do médico,
// que é um local onde ele poderá visualizar os seus dados e escolher uma clínica dentre todas as clínicas que
// trabalha para entrar no sistema.
app.controller("HomeMedicoController",function($http,$scope,$sessionStorage){
  // Os dados do médico, bem como suas especialidades, são obtidos da variável de sessão $sessionStorage.
  $scope.medico         = $sessionStorage.medico;
  $scope.especialidades = $sessionStorage.especialidades;
  $scope.loginMedico    = $sessionStorage.loginMedico;
  // Caso já tenhamos pesquisado as clínicas no banco de dados, não pesquisaremos novamente ao entrar
  // nessa página, mas sim obteremos elas da variável de sessão $sessionStorage.
  if ($sessionStorage.isClinicaJaPesquisada)
    $scope.clinicas = $sessionStorage.clinicas;
  else
	// Caso ainda não tenhamos pesquisado as clínicas no banco de dados (primeira vez que entramos nessa página),
	// pesquisamos elas no banco de dados e as colocamos na variável de sessão $sessionStorage.
    $http.get("http://wsmedico.cfapps.io/getClinicas").success(function(data){
      $scope.clinicas = data;
      $sessionStorage.clinicas = data;
      $sessionStorage.isClinicaJaPesquisada = true;
    });
    
  $scope.nomeClinica = "";
  $scope.pesquisarClinicasPorNome = function(){
    $http.get("http://wsmedico.cfapps.io/getClinicasPorNome/"+$scope.nomeClinica).success(function(clinicas){
      $scope.clinicas = clinicas;    
    }).error(function(erro){
      console.log(erro);    
    });
  };
  
  // Método para exibir os dados do médico logado, que são nome,CRM e especialidades nas quais atua.
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
 
  // Ao exibir todas as clínicas em que o médico trabalha em uma tebela, poderemos clicar em cada um dos registros
  // dessa tabela. Ao clicarmos em um deles, o método abaixo será executado, o qual pergunta ao usuário se ele deseja
  // entrar na área da clínica selecionada.
  $scope.selecionarClinica = function(indice){	
	// Obtém o objeto da clínica selecionada, através da indexação no vetor das clínicas armazenadas com base
	// na variável indice, que é o número da linha selecionada na tabela.
	var clinica  = $scope.clinicas[indice];
    bootbox.confirm({
      message:"<span style = 'font-family:Arial;font-size:18px'> Deseja entrar em sua área da clínica "+clinica.nome+"? </span>",
      buttons:{
    	cancel:{
          label     : 'Não',
    	  className : 'btn-default'
        },
    	confirm:{
    	  label     : 'Sim',
    	  className : 'btn-primary'
    	}
      },
      callback:function(result){
    	// Caso o usuário deseje entrar na área da clínica selecionada, realizamos o método loginMedico do Web Service
    	// de médicos, o qual recebe como parâmetro o id da clínica selecionada e com base nisso armazena os dados 
    	// dessa clínica em um objeto no próprio Web Service de médicos.
    	if (result){
    	  $http.get("http://wsmedico.cfapps.io/loginMedico/"+clinica.id).success(function(data){
    		// Também armazenamos os dados da clínica selecionada na variável de sessão $sessionStorage.
    	    $sessionStorage.clinica = clinica;
          });
    	  // Obtemos todos os convênios que essa clínica possui e os armazenamos na variável de sessão $sessionStorage.
    	  $http.get("http://wsmedico.cfapps.io/getConvenios").success(function(data){
    	    $sessionStorage.convenios = data;
    	    window.location.href = "visualizaHorario.html";
    	  });
        }
      }
    });
  };
});

// Controller que tratará a inclusão de horários no banco de dados.
app.controller("InclusaoHorarioController",function($http,$scope,$filter,$sessionStorage){
  // Armazena os dados que serão utilizados pelo web service de médico para o cadastro dos 
  // horários em série.
  $scope.horario = {
    dia:"",
    dataInicio:null,
    dataFim:null,
    horaInicio:null,
    horaFim:null,
    duracao:null,
    intervalo:null
  };
  // Obtém os dados do médico logado, da clínica escolhida pelo médico para entrar no sistema e os
  // convênios dessa clínica.
  $scope.medico    = $sessionStorage.medico;
  $scope.clinica   = $sessionStorage.clinica;
  $scope.convenios = $sessionStorage.convenios;
  
  // Selecionaremos um dia da semana em um dropdown-menu.
  // A variável abaixo armazena o dia da semana selecionado.
  $scope.diaSemana = "Segunda-feira";
  $scope.horario.dia = "SEG";
  
  // Ao selecionarmos um dia da semana no dropdown-menu, o método abaixo será chamado, o qual
  // recebe como parâmetro o dia da semana selecionado abreviado (para executarmos o método 
  // cadastrarHorario do web service) e o dia da semana selecionado não abreviado (para exibirmos
  // ele como um título).
  $scope.selecionarDia = function(diaAbreviado,diaSemana){
    $scope.diaSemana = diaSemana;
    $scope.horario.dia = diaAbreviado;
  };
  
  // Método que exibe os dados da clínica que o médico escolheu para entrar no sistema.
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
  
  // Incluímos horários em série no banco de dados com base nos dados armazenados no objeto horario.
  $scope.incluirHorario = function(){
    // Horário de início das atividades (em segundos).
    var horaInicio = 
      horario.horaInicio.getSeconds() +
      horario.horaInicio.getMinutes()*60+
      horario.horaInicio.getHours()*3600;
    // Horário de término das atividades (em segundos).
    var horaFim = 
      horario.horaFim.getSeconds()+
      horario.horaFim.getMinutes()*60+
      horario.horaFim.getHours()*3600;
      
    
	var horario       = $scope.horario;
	// Calculamos o tempo que o método ficará trabalhando (em segundos), com base no horário de
	// início das atividades e no horário de término.
	var tempoTrabalho = horaFim - horaInicio;
	// Calculamos o tempo entre o início de uma consulta o início de outra posterior (em segundos), 
	// com base na duração de cada consulta (em segundos) e no intervalo entre as consultas (em segundos).
	var tempoEntreConsultas = 
	  // Duração de cada consulta (em segundos).
	  (horario.duracao.getSeconds()+ 
	   horario.duracao.getMinutes()*60+
	   horario.duracao.getHours()*3600)+
	   // Intervalo entre as consultas (em segundos).
	  (horario.intervalo.getSeconds()+
	   horario.intervalo.getMinutes()*60+
	   horario.intervalo.getHours()*3600);
	// Pensemos no seguinte caso como exemplo: o tempo de trabalho é de 100 segundos e o tempo 
	// entre o início de uma consulta e o início de outra posterior é de 15 segundos. Para obtermos
	// o número de consultas com base nesses dados, não podemos fazer 100/15, pois isso não resultaria
	// em um número natural. Temos que obter o número máximo de períodos de 15 segundos em um período maior
	// de 100 segundos, que seria 6, pois 15*6 = 90 (próximo de 100) e 15*7 = 105 (ultrapassa 100). Logo,
	// nesse caso, para obter o número de períodos de 15 segundos, devemos retirar 10 (resto da divisão 
	// de 100 por 15) de 100, para resultar em 90 (número divisível por 15).
	var resto         = tempoTrabalho % tempoEntreConsultas;
	var qtasConsultas = (tempoTrabalho - resto)/tempoEntreConsultas;
	
	horario.horaInicio.setSeconds(0);
	horario.duracao.setSeconds(0);
	horario.intervalo.setSeconds(0);
	
	// Cadastramos os horários efetivamente com base nos dados obtidos.
    $http.get(
      "http://wsmedico.cfapps.io/cadastrarHorario/"+
      horario.dia+"/"+
      horario.dataInicio.getFullYear()+"-"+
      (horario.dataInicio.getMonth()+1)+"-"+
      horario.dataInicio.getDate()+"/"+
      horario.dataFim.getFullYear()+"-"+
      (horario.dataFim.getMonth()+1)+"-"+
      horario.dataFim.getDate()+"/"+
      horario.horaInicio.getHours()+":"+
      horario.horaInicio.getMinutes()+":"+
      horario.horaInicio.getSeconds()+"/"+
      horario.duracao.getHours()+":"+
      horario.duracao.getMinutes()+":"+
      horario.duracao.getSeconds()+"/"+
      horario.intervalo.getHours()+":"+
      horario.intervalo.getMinutes()+":"+
      horario.intervalo.getSeconds()+"/"+
      qtasConsultas
    ).success(function(data){
      $("#alertInclusao").show();
      // Após cadastrarmos os horários, atualizamos o vetor de horários no $sessionStorage,
      // para que a tabela de horários seja atualizada automaticamente.
      $http.get("http://wsmedico.cfapps.io/getHorarios").success(function(data){
        $sessionStorage.horarios = data; 
      });
    }).error(function(data){
      $("#alertErroInclusao").show();
    });
  };
});

// Controller que irá tratar a manipulação dos horários do médico que estarão expostos em uma tabela.
app.controller("HorariosController",function($http,$scope,$filter,$sessionStorage){	
  // Obtemos os dados do médico logado, da clínica selecionada e dos convênios dessa clínica
  // da variável de sessão $sessionStorage.
  $scope.medico    = $sessionStorage.medico;
  $scope.clinica   = $sessionStorage.clinica;
  $scope.convenios = $sessionStorage.convenios;	
	
  // Selecionaremos um dia da semana em um dropdown-menu.
  // A variável abaixo armazena o dia da semana selecionado.
  $scope.diaSemana = "Dia da semana";
  
  // Ao selecionarmos um dia da semana no dropdown-menu, o método abaixo será chamado, o qual
  // recebe como parâmetro o dia da semana selecionado abreviado (para executarmos o método 
  // getHorariosPorDia do web service) e o dia da semana selecionado não abreviado (para exibirmos
  // ele como um título). O método pesquisará todos os horários em determinado dia da semana.
  $scope.selecionarDia = function(diaAbreviado,diaSemana){
	$scope.data = null;
    $scope.diaSemana = diaSemana;
    $http.get("http://wsmedico.cfapps.io/getHorariosPorDia/"+diaAbreviado).success(function(data){
      $scope.horarios = data;
    });
  };
 
  // Ao selecionarmos uma data no input date, o método abaixo será chamado, o qual pesquisa todos os horários
  // em determinada data.
  $scope.selecionarData = function(){
	$scope.diaSemana = "Dia da semana";
	var data = $scope.data;
    $http.get(
      "http://wsmedico.cfapps.io/getHorariosPorData/"+
      data.getFullYear()+"-"+
      (data.getMonth()+1)+"-"+
      data.getDate()
    ).success(function(resultado){
      $scope.horarios = resultado;
    });
  };
  
  // Fecha as mensagens auxiliares que indicam quando um registro foi excluído ou alterado com sucesso.
  $scope.fecharAlert = function(){ 
    $("#alertExclusao").hide();
    $("#alertAlteracao").hide();
  };
  
  // Método que exibe todos os horários na tabela. Ao preencher a variável horarios com todos os horários,
  // automaticamente a tabela será atualizada, devido à utilização da notação ng-repeat do Angular.
  $scope.exibirTodos = function(){
	$scope.fecharAlert();
	$scope.horarios = $sessionStorage.horarios; 
  };
  
  // Método que exibe os dados da clínica que o médico escolheu para entrar no sistema.
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
  
  // Pesquisa todos os horários do médico logado e armazena-os na variável de sessão $sessionStorage.
  $http.get("http://wsmedico.cfapps.io/getHorarios").success(function(data){
    $scope.horarios = data;
    $sessionStorage.horarios = data;
  }).error(function(erro){
    console.log(erro);	  
  });
  
  // Método que trata a manipulação dos dados de um horário selecionado dentre todos os horários da tabela.
  $scope.selecionarHorario = function(indice){  
	$scope.fecharAlert();
	// Obtém o objeto do horário selecionado a partir da indexação no vetor de horários armazenado, com base
	// na variável indice, que é o número da linha selecionada na tabela.
    $scope.horario = $scope.horarios[indice];
    
    // Executamos o método getConsulta, passando como parâmetro o horário selecionado. Se o método retornar
    // uma consulta nula, quer dizer que não há consulta marcada para o horário selecionado. Caso contrário,
    // há uma consulta marcada para o horário selecionado e armazenados os dados do paciente que marcou essa
    // consulta na variável paciente abaixo.
    $scope.paciente = null;
	$http.get("http://wsmedico.cfapps.io/getConsulta/"+$scope.horario.id).success(function(consulta){  
	  if (consulta != null)
	    $scope.paciente = consulta.paciente;
	});
	
	// Exibimos as opções para excluir e alterar o horário selecionado na tabela. Exibiremos como título a 
	// data, o horário de início e o horário de término armazenados no objeto Horário do horário selecionado.
	bootbox.dialog({
	  message:"<span style = 'font-family:Arial;font-size:18px'> O que você deseja realizar? </span>",
	  buttons:{
		btnExcluir:{
		  label:"Excluir",
		  class:"btn-default",
		  // Caso desejarmos excluir o horário selecionado.
		  callback:function(){
			bootbox.confirm({
			  title:
				$filter('date')($scope.horario.data,'dd/MM/yyyy') + ", " + 
			    $scope.horario.horaInicio + " - " +
			    $scope.horario.horaFim,
			  message: function(){
				// Caso a variável paciente for nula, significa que não há consulta marcada para esse horário e podemos
				// excluí-lo tranquilamente.
				if ($scope.paciente == null)
				  return "<span style = 'font-family:Arial;font-size:18px;'>Deseja realmente excluir esse horário?</span>";
				else
				// Caso contrário, há uma consulta marcada para esse horário, com o paciente cujos dados estão armazenados
			    // na variável paciente. Exibimos os dados dessa consulta. Caso esse horário selecionado seja excluído, essa
				// consulta será cancelada automaticamente.
				  return $("#exclusaoHorario").html();
			  },
			  buttons:{
			    cancel:{
			      label     : 'Não',
			      className : 'btn-default'
			    },
			    confirm:{
			      label     : 'Sim',
			      className : 'btn-primary'
			    }
			  },
			  callback:function(result){
				if (result){
				  // Excluímos o horário selecionado efetivamente.
			      $http.get("http://wsmedico.cfapps.io/excluirHorario/"+$scope.horario.id); 
			      $scope.horarios.splice(indice,1);
				  $sessionStorage.horarios = $scope.horarios;
				  $("#alertExclusao").show(); 
				}
			  }
			});
		  }
		},
		btnAlterar:{
		  label:"Alterar",
		  class:"btn-primary",
		  // Caso desejarmos alterar o horário selecionado.
		  callback:function(){
		    bootbox.dialog({
			  title:
			    $filter('date')($scope.horario.data,'dd/MM/yyyy') + ", " + 
			    $scope.horario.horaInicio + " - " +
			    $scope.horario.horaFim,
			  message:$("#alteracaoHorario").html(),
			  buttons:{
			    btnCancelar:{
			      label:"Cancelar",
			      class:"btn-default",
			    },
			    btnAlterar:{
			      label:"Alterar horário",
			      class:"btn-primary",
			      callback:function(){
			    	// Objeto do novo horário. Os dados que poderiam ter sido alterados são
			    	// data,horaInicio e horaFim.
			        var horarioAlterado = {
			          id         : $scope.horario.id,
			          medico     : $scope.horario.medico,
			          clinica    : $scope.horario.clinica,
			          data       : $("#txtData").val(),
			          horaInicio : $("#txtInicio").val(),
			          horaFim    : $("#txtFim").val()
			        };
			        $scope.horario = horarioAlterado;
			        // Alteramos o horário e atualizamos ele no vetor de horários armazenado, que por conta do atributo
			        // ng-repeat do Angular, fará atualizar automaticamente a tabela de horários.
	                $http.post("http://wsmedico.cfapps.io/alterarHorario",$scope.horario).success(function(){
	                  $scope.horarios[indice] = $scope.horario;
		              $sessionStorage.horarios = $scope.horarios;
		              $("#alertAlteracao").show();	
	                }).error(function(){
	                  $("#alertErroAlteracao").show();
	                  
	                });
			      }
			    }
			  }
			});
		  }
	    }
	  }
	});
  };
});

})();
