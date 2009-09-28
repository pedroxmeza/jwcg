/*
############################################
# Metodos de ordenamiento
############################################

  existen diferentes metodos de ordenamiento,
  estos quedan fuera de la clase principal
  pero con el prefijo _jwcg (funcion global)
  la clase llama a la funcion _jwcgSelectSortingMethod
  con los parametros 
  mtrx,colName,method,nRows
  donde :
    - mtrx        : matriz con la grilla (formato Json).
    - colName     : columna a ordenar de la grilla. 
    - method      : metodo de ordenamiento                    
    - nRows       : numero de filas

  en cada una de las implementaciones junto con el arreglo a ordenar
  se debe declarar un arreglo "index" el cual contiene la posicion
  actual de los elementos, luego de ordenado el arrglo se retorna
  Index con las nuevas posiciones,con el cual finalmente 
  se ordena la matriz                   
*/

function _jwcgSelectSortingMethod(mtrx,colName,method,nRows) {
    var arr = new Array();
    
    for(var i=0;i<nRows;i++) { // traspaso arreglo json a arreglo tradicional
    		eval("arr["+i+"] = mtrx["+i+"]."+colName);
    		// TODO : debe existir algo mejor que esto....
    }
    if (method == "shellsort") {
            var newIndex = _jwcgShellSort(arr);
    }
    if (method == "heapsort") {
            var newIndex = _jwcgHeapSort(arr);
    }
    return newIndex; 
}
	

//################# IMPLEMENTACION DE SHELLSORT ################# 
function _jwcgShellSort(arr) {
	try {
		var j,i,v,h,k,ixv;
		var len = arr.length;
	//******************************************************************************************
		var index = new Array();
		for(var ix=0;ix < arr.length;ix++)	index[ix] = ix; // Genera indice para el arreglo
	//******************************************************************************************	
		
		var vx;

		for (h=1; h < len; h=3*h+1);
			h=(h-1)/3
			while (h) {
				for (i=h, j=i, v=arr[i], vx=index[i]; i<=len; arr[j+h]=v,index[j+h]=vx, i++, j=i, v=arr[i],vx=index[i]) {
					while((j-=h) >= 0 && arr[j] > v) {
						arr[j+h]=arr[j];
						index[j+h]=index[j];
					}
				}
				h=(h-1)/3
			}
	} catch(e) {
			alert("Error  shellsort: " + e.description)
	}
	return index
}


//################# IMPLEMENTACION DE HEAPSORT #################
function _jwcgHeapSort(arr) {
  try {
 //******************************************************************************************
    var index = new Array();
  	for(var ix=0;ix < arr.length;ix++)	index[ix] = ix; // Genera indice para el arreglo
 //******************************************************************************************  	
    var  i, temp, done, maxChild, stemp , itemp;
    var array_size = arr.length;
     
    
    for (i = (array_size / 2)-1; i >= 0; i--){

      done = 0;
      root = i;
      bottom = array_size;
      
      while ((root*2 <= bottom) && (!done))   {
        if (root*2 == bottom)
          maxChild = root * 2;
        else if (arr[root * 2] > arr[root * 2 + 1])
          maxChild = root * 2;
        else
          maxChild = root * 2 + 1;
    
        if (arr[root] < arr[maxChild]) {
          temp = arr[root];
          itemp  = index[root];
          
          arr[root] = arr[maxChild];
          index[root] = index[maxChild]; 
          
          arr[maxChild] = temp;
          index[maxChild] = itemp;
          root = maxChild;
        }
        else
          done = 1;
      }
      
    }
        
    for (i = array_size-1; i >= 1; i--)  {
      temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      
      itemp = index[0];
      index[0] = index[i];
      index[i] = itemp;
      
      done = 0;
      root = 0;
      bottom = i-1;
      
      while ((root*2 <= bottom) && (!done))   {
        if (root*2 == bottom)
          maxChild = root * 2;
        else if (arr[root * 2] > arr[root * 2 + 1])
          maxChild = root * 2;
        else
          maxChild = root * 2 + 1;
    
        if (arr[root] < arr[maxChild]) {
          stemp = arr[root];
          itemp = index[root];
          
          arr[root] = arr[maxChild];
          index[root] = index[maxChild];
          
          arr[maxChild] = stemp;
          index[maxChild] = itemp;
          
          root = maxChild;
        }
        else
          done = 1;
      }
       
    }
    
    return index
  } catch(e){
  		alert("Error HeapSort: " + e.description+" ["+e+"]")
  }    
}



	   
	