/*
############################################
# Metodos de B�squeda
############################################

  los metodos de b�squeda quedan fuera de la 
  clase principal pero con el prefijo _jwcg (funcion global)
  la clase llama a la funcion _jwcgSelectSearchMethod
  con los parametros 
  oMatrix,colName,method,nRows,patron
  donde :
    - oMatrix     : matriz con la grilla (formato Json).
    - colName     : columna a buscar 
    - method      : metodo de busqueda                    
    - nRows       : numero de filas
    - patron      : patron de b�squeda

  la implementaci�n de la b�squeda, debe devolver un arreglo con las 
  posici�nes donde se encontro el patron.
   
  *** los metodos de b�squeda son por patron, esto debido a que el contenido
  puede ser un texto con m�s de una frase ej "Bob dylan" y 
  el patron de busqueda puede ser cualquiera de las frases del texto y 
  no necesariamente la primera.
              

*/              


function _jwcgSelectSearchMethod(oMatrix,colName,method,nRows,patron) {
	 try {
	     
        var texto  ="";
        var cm		 = String.fromCharCode(34);
        var value = "";       
        /* 
          ciclo para generar string para hacer b�squeda por patrones,
          a este string se le concatena el indice para luego buscar
          estos indices en el arreglo.  
          el formato es:
          
          [indice]@[texto de la columna]|
          
          ej:
          1@Bob Dylan|2@Bonnie Tyler|3@Dolly Parton...etc
          
        */          
        
        for(var i=0;i < nRows;i++) {
        /*
           TODO : esto es factible en arreglos cortos pero si son arreglos
           largos podria ocurrir que el string no aguante.
           una posible solucion es dividir el string y llevar cada
           extracto a variables en cookies, luego al buscar,
           se levanta en una variable string el contenido de las 
           variables de la cookie una a una hasta terminar con la b�squeda.             
        */            
         
            eval ("value  = oMatrix["+i+"]."+colName) 
        		texto += i+"@"+value+"|"; 
            
        }  
        var retorno;
        if (method == "boyermoore") {
          retorno = _jwcgBMSearch(patron,texto);
          texto   = null;
          patron  = null;
          return retorno;
        }
          
 	} catch(e) {
		alert("Error _jwcgSelectSearchMethod:"+e.description)
	}
}


//implementaci�n algoritmo de b�squeda de Boyer-Moore                      
function _jwcgBMSearch(patron,texto) {
  try {

        var buscaDesde        = 0;
        var posCoincidencia   = 0;
        var encontrado        = false;
        
        var largoPatron = patron.length-1;
        var largoTexto  = texto.length;
        var textoencontrado = "";
        var inicio  = 0;
        var fin     =0;
        var substr  ="";
        var indice  =""; // resultado a retornar
        var sw = true;
        while (sw) {
            /* 
              busca el �ltimo caracter del patr�n dentro del largo de la cadena
            */
            posCoincidencia = texto.indexOf(patron.charAt(largoPatron),buscaDesde);  
            /* 
              si dentro de la cadena no existe el caracter entonces no existe
               el patr�n, se acaba el ciclo
            */
            if (posCoincidencia ==-1 ) {
                sw = false;
            } else {
              // esto es para la siguiente vuelta del ciclo.
              buscaDesde = posCoincidencia+1;
              /* 
                  la posici�n de la coincidencia debe ser mayor al 
                  largo del patr�n. 
              */
              if (posCoincidencia > largoPatron) {
                  textoencontrado = texto.substring(posCoincidencia - largoPatron,posCoincidencia+1);
                  if (textoencontrado == patron) {
                            
                            // busco el indice de la cadena
                            substr = texto.substring(0,posCoincidencia+1);
                            inicio = substr.lastIndexOf("|")+1;
                            fin = substr.lastIndexOf("@");
                            indice += substr.substring(inicio,fin)+";"; 
                  } 
              }  
            }
        }
        indice = indice.substring(0,indice.length-1); // quito el ultimo separador
        return indice.split(";");
        
  
  } catch(e) {
		alert("Error _jwcgBMSearch:"+e.description)
	}
}