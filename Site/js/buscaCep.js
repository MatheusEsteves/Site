new Vue({

    el:'#vue',
    
    data: {
      cep:'',
      endereco:{},
      naoLocalizado: false
    },
    
    //é executado qdo a página for carregada por completo
   attached: function(){
    jQuery(this.$$.cep).mask('99999-999');
    },
    
    methods:{
        buscar: function()
        {
          var self = this; //faz uma cópia do this           
           
          //indica que o cep deve ter 5 número - e mais 3 números
          //ou seja deve ser do tipo 00000-000                   
          if(/^[0-9]{5}-[0-9]{3}$/.test(this.cep))
          {              
           //pesquisa o cep no site viacep      
           jQuery.getJSON('http://viacep.com.br/ws/'+this.cep+'/json/', 
                          function(endereco){                            
                            self.endereco = endereco; //se eu por o this aqui, ele vai se referir ao JSON
                            self.naoLocalizado = false;
               
                            if(endereco.erro)                            
                            {
                                self.naoLocalizado = true;
                                jQuery(self.$$.cep).focus();                                
                            }
                            else                            
                                jQuery(self.$$.numero).focus();                                  
                            
                         });
          }
        }
    }
    
    });