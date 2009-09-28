//*****************************************************************************************
//    Javascript Web Control Grid es una clase para crear tablas dinamicas
//    Copyright � 2008, 2009  Pedro Meza A.
//
//    email : pedroxmeza@gmail.com
//
//    This file is part of Javascript Web Control Grid
//
//    Javascript Web Control Grid is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    Javascript Web Control Grid is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with Javascript Web Control Grid.  If not, see .
//
//*****************************************************************************************
/*
##############################################
 Clase para crear tablas dinamicas      

 metodos disponibles  : 
  - getRemoteData      : Extrae data desde 
    archivos xml o json remotos
  - render             : dibuja tabla dinamica
  - sortGrid           : ordena columnas
  - loadEnvironment    : carga variables 
    necesarias para el funcionamiento de la 
    grilla (constructor)
  - y una que otra que tengo que agregar...:P
##############################################
*/


// funcion para incluir las demas librerias 
function _jwcgIncludeJS(p_file) {
			var v_js  = document.createElement('SCRIPT');
			v_js.type = 'text/javascript';
			v_js.src = p_file;
			document.getElementsByTagName('head')[0].appendChild(v_js);
}


function webControlGrid() {
		this.htmlContainer			= "";				     			// Debe contener el id del div que contendra el html de la grilla
		this.libPath						= "";			    			  // Indica el path donde se encuentran las librerias 
		this.objectName				  = "";				     			// Nombre del objeto (se usa para hacer referencia interna)
		this.editableCells			= false;	    				// No implementado
		this.alternateColor		 	= false;				     	// Activa la alternancia de color entre celdas
		this.alterColor1		  		= "";					  		// Color 1 de celda
		this.alterColor2			  	= "";						   	// Color 2 de celda
		this.returnFunctionName 	= "";							  // Nombre de funcion que captura id de celda
		this.remoteDoc            = null; 						// Objeto HTMLRequest
		this.setLabelColumn       = new Array(); 			// Nombres de las etiquetas de los encabezados
		this.setSizeColumn        = new Array();		  // Arreglo con tama�o individual de columnas
		this.setTableLayoutWidth  = "650";				    // Tama�o del Ancho contenedor de la tabla
		this.setTableLayoutHeight = "370";				    // Tama�o del Alto contenedor de la tabla
		this.defaultColumnSize    = "90";				 		  // Tama�o de cada columna
		this.setTagNameInColumn   = new Array(); 	    // Indica cuales tags del XML iran en las columnas
		this.gridContent          = new Array();  	  // (Uso Interno) arreglo con el contenido de la grilla
		this.nCols                = 0;								// numero de columnas (uso interno)
		this.nRows                = 0;								// numero de filas (uso interno)
		this.sortMethod           = "shellsort";       // metodo de ordenamiento (por defecto shellsort)
		// selectionGrid
		this.enabledRollOver      = true;             // activa fila al pasar el mouse por encima
		this.activeRowColor       = "#9BC2E3";        // Color fila seleccionada
		this.auxActiveRowColor    = "";               // (Uso interno) captura ultimo color antes de ser Destacado con .activeRowColor  
		this.idCellSelected       = "";               // (Uso Interno) guarda Id de Celda seleccionada 
		this.bgCellSelected       = "";               // (Uso Interno) guarda color de fondo de celda seleccionada
		// dynamic widtth
		this.XMouseXPos           =0;                 // (Uso Interno) captura movimientos de la grilla
		this.XmouseStartPos;                          // (Uso Interno) 
  	this.SelectColumn;                            // (Uso Interno)
  	this.SelectHColumn;                           // (Uso Interno)
  	this.ScNrows				     = 0;                 // (Uso Interno)
  	this.WidthOrig;                               // (Uso Interno)
  	this.StatusMov			      = false;            // (Uso Interno)
    		
		
		this.grid							    = "";							
		this.id                   = "matrix";
		
		this.loadEnvironment      = function() {
			// carga el resto de las librerias
			_jwcgIncludeJS(this.libPath+"dynamicWidth.js");
			_jwcgIncludeJS(this.libPath+"selectionGrid.js");
			_jwcgIncludeJS(this.libPath+"sortMethod.js");
			
			// captura del movimiento del mouse
			var toEval = "";
	    toEval += "try {                                                                                      ";
	    toEval += "     document.getElementById(this.htmlContainer).onmousemove = function(ev) {              ";
      toEval += "        try {                                                                              ";
      toEval += "          	  ev = (ev) ? ev : ((window.event) ? event : null);                             ";
      toEval += "        			if(ev.pageX || ev.pageY){                                                     ";
      toEval += "          				var mousePos =  {x:ev.pageX, y:ev.pageY};                                 ";
			toEval += "             }	else {                                                                      ";
      toEval += "                  var mousePos = {                                                         ";
    	toEval += "			                x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,   ";
    	toEval += "			                y:ev.clientY + document.body.scrollTop  - document.body.clientTop     ";
    	toEval += "		               }                                                                        ";
      toEval += "        			}                                                                             ";
      toEval += "             "+this.objectName+".XMouseXPos = mousePos.x;                                  ";
      toEval += "                                                                                           ";
      toEval += "     	} catch(e) {                                                                        ";
      toEval += "    		    alert('Error captura de movimiento del mouse :'+e.description+' error:'+e);     ";
      toEval += "    	  }                                                                                   ";
      toEval += "     }                                                                                     ";
      toEval += "} catch(er) {                                                                              ";
      toEval += "  alert(er);                                                                               ";
      toEval += "}";
			eval(toEval);
       
			// en caso de que las columnas no esten definidas por el usuario se toma el valor por defecto (06-08-2009)
			if (!this.setSizeColumn[0]) {
				var cols = this.setLabelColumn.length;
				for(var i=0;i< cols;i++) {
					this.setSizeColumn[i] = this.defaultColumnSize;
				}
			}
    }


		this.getRemoteData        = function(remotePath,dataType) {
		/*
         remotePath : url del archivo xml o Json
         dataType   : xml; si es un archivo XML. json; si es un archivo JSON
    */
			try {
  			try {  
  					this.remoteDoc = new ActiveXObject('Msxml2.XMLHTTP');   
  				} catch (e) {
  						try {   
  							this.remoteDoc = new ActiveXObject('Microsoft.XMLHTTP');    
  						} catch (e2) {
  						  try {  
  							  this.remoteDoc = new XMLHttpRequest();     
  						} catch (e3) {  
  							this.remoteDoc = false;   
  						}
  					}
  				}
  
  			 var remoteDoc = this.remoteDoc;
         var parameter = (dataType == "xml")?"remoteDoc.responseXML":"eval(remoteDoc.responseText)";				
  			 var toEval    = "";
  			 toEval +="remoteDoc.onreadystatechange  = function() {";
  			 toEval +=" try {";
  			 toEval +="			if (remoteDoc.readyState == 4) {";
  			 toEval +="			  "+this.objectName+".remoteDoc = remoteDoc;";
         toEval +="			  "+this.objectName+".process"+dataType.toUpperCase()+"("+parameter+");";
         toEval +="  		}";
  			 toEval +=" } catch (e) {";
  			 toEval +="     alert('Error,  onreadystatechange : '+e.description);";
  			 toEval +=" 	}";
  			 toEval +=" }";
         eval(toEval);  			
           
  		 	 // peticion xml asincronica 
  			 remoteDoc.open("GET", remotePath, true ); 
  			 remoteDoc.send(null);


			} catch (e) {
					alert("Error load remoteData: " + e.description + " ["+e+"]")
			}

		}
		this.processXML	= function(xmlDoc) {
			try {
		
					var oTags	= this.setTagNameInColumn;
					var n			= oTags.length;  // numero de columnas
					var nReg 	= 0;             // cantidad de filas					
					var objCells	= new Array;
					var fila			="var oMatrix = [ ";
					var cm			= String.fromCharCode(34);
					
					
					
					
					// ** por algun motivo IE necesita recargar **
					if (navigator.appName == "Microsoft Internet Explorer") {
						this.remoteDoc.responseXML.load(this.remoteDoc.responseBody);
						/* 15-06-2009
						* OJO con esto que no tiene mucho sentido, funciono para ie8
						* pero me parece que no deberia se necesario dado que this.xmlDoc
						* se desecha en este modulo y se utiliza xmlDoc declarada
						* mas arriba
						*/
					}
					
					// 09-09-2009 el arreglo ahora es JSON 
					// "var DATA = [{ campo:valor,campo:valor } ,{campo:valor,campo:valor}]"; 
					nReg = xmlDoc.getElementsByTagName(oTags[0]).length
					for(var c=0;c<n;c++){
						objCells[c] = xmlDoc.getElementsByTagName(oTags[c]);
					}
					for(var r=0; r < nReg ; r++) {
						fila +="{"
						for(var c=0;c<n;c++){
								fila += cm+oTags[c] +cm+":"+cm+objCells[c][r].firstChild.nodeValue+cm+","
						}
						fila = fila.substring(0,fila.length-1); // saca la ultima coma
						fila +="},"
					}
					fila = fila.substring(0,fila.length-1); // saca la ultima coma
					fila += "];";
					eval(fila);
					this.gridContent	= oMatrix;
					this.nCols			= oTags.length;
					this.nRows			= nReg;
					
					
					eval( this.objectName + ".render();");
					
			} catch (e) {
								alert("Error processXML: " + e.description + " ["+e+"]")
			}
		}
		this.processJSON	= function(jsonObject) {
		/*
						el formato del arreglo debe ser 
						[{ "Campo1":"Valor1","Campo2":"Valor2"...."CampoN":"ValorN"},{"CampoN":"ValorN","CampoN":"ValorN"}];
		*/
					                           
					this.gridContent	= jsonObject;
					this.nCols			  = this.setTagNameInColumn.length;
					this.nRows			  = jsonObject.length;
       
					eval( this.objectName + ".render();");
                                                   
		}
		this.renderFixPosition = function() {
		// TODO : este metodo debe ser capaz de redibujar la grilla dejando la fila o culumna indicada fija		
		}
		this.render	= function() {
			try	{
				var idCell		= "";
				var ancho		= "";
				var defSize;
				var oCell;
				var cell;
				var cellColor	= "";
				var oMatrix		= this.gridContent;
				var bodyTbl		= "<div id='"+this.id+"_body' onscroll='"+this.objectName+".setHeaderPosition()' class='matrix_body'>";// el on scroll es para cuando se mueve el scroll (06-08-2009)
				var idCellChild;	
				var classNameCellX="";
				var classNameCellY="";
				// ############# BODY GRID ################################################################# 
				bodyTbl		+=" <table border=0 cellpadding=0 cellspacing=0 style='table-layout:fixed' width=100%>";
				for(var r = 0;r < this.nRows;	r++){
					bodyTbl += "<tr class='row'>";
					bodyTbl += "<td class='IndexHeaderColumn' style='width:30px;table-layout:fixed'>"+(r+1)+"</td>";						
					for(var c = 0 ; c < this.nCols; c++){
						if (this.alternateColor) { // row alter color
							cellColor = (r%2 == 0)?this.alterColor1:this.alterColor2;
						}
						
						idCell	= this.id+"_cell.x"+c+".y"+r;
						// clases dinamicas (CSS) 
						classNameCellX	= "jwcgCellX_"+c;
						classNameCellY	= "jwcgCellY_"+r;
						
						defSize = this.setSizeColumn[c]+"px";
						
						ancho = "width:"+defSize+";";
						
						// 09-09-2009 la celda se deve evaluar, esto por que el arreglo al se JSON 
						// se obtiene por el nombre y no por posicion, ej oMatrix[0].Artist y no oMatrix[0][0]
						eval("cell = oMatrix["+r+"]."+this.setTagNameInColumn[c]);
						
						if (cell){
							bodyTbl	+= "<td  style='"+ancho+"background-color:"+cellColor+"'";
							bodyTbl	+= "    id='"+idCell+"' class='cell "+classNameCellX+" "+classNameCellY+"' onMouseOver="+this.objectName+".turnOn(this) onMouseOut="+this.objectName+".turnOff(this)";
							bodyTbl	+= "    onClick="+this.objectName+".clickMe(this,'"+this.returnFunctionName+"') >"+String(cell);
							bodyTbl	+= "</td>";
						} else { // si la asignacion es nula
							bodyTbl += "<td style='"+ancho+"background-color:"+cellColor+"'";
							bodyTbl += "       id='"+idCell+"'>";
							bodyTbl += "</td>";
						}
					}
					bodyTbl += "</tr>";
				}
				bodyTbl +="</table></div>";

				// ############# HEADER	 GRID ################################################################# 
				var HTable ="<div id='"+this.id+"_header' class='matrix_header'>";
				HTable +=" 		<table border=0 cellpadding=0 cellspacing=0 style='table-layout:fixed' width=100%><tr>"; 
				HTable += "			<td style='width:30px' id='indexCol' class='headerColumn' style='table-layout:fixed'>";
				HTable += "				<table border=0 cellpadding=0 cellspacing=0 width=100% class='headerColumn' ";
				HTable += "						style='table-layout:fixed' >";
				HTable += "	 				<tr>";
				HTable += "		  				<td >#</td>";
				HTable += "		 			</tr>";
				HTable += "				</table>";
				HTable += "			</td>";
									
				for(var e=0;e< this.setLabelColumn.length;e++){
					idCell		= this.id+".headerColumn."+e+";";
					idCellChild = this.id+"_cell.x"+e+".y0";
					defSize = this.setSizeColumn[e]+"px";
					
					HTable += "<td style='width:"+defSize+"' id='"+idCell+"' class='headerColumn'>";
					HTable += "		<table border=0 cellpadding=0 cellspacing=0 width=100%  ";
					HTable += "				style='table-layout:fixed' onMouseOver=this.className='headerColumnOn' "; 
          HTable += "				onMouseOut=this.className='headerColumn'  onDblClick="+this.objectName+".sortGrid("+e+",'"+idCell+"')>";
					HTable += "	 		<tr>";
					HTable += "				<td width=80%>"+this.setLabelColumn[e]+"</td>";
					HTable += "				<td class='ordenArrow'><div id='orden_"+idCell+"' >&#9830;</div></td>";
					HTable += "				<td class='cellSplit' onMouseDown=\""+this.objectName+".startMov('"+idCell+"','"+idCellChild+"',"+this.nRows+");\">&nbsp;</td>";
					HTable += "			</tr>";
					HTable += "		</table>";
					HTable += "</td>";
				
				}
				HTable	+=" </tr></table>";
				HTable	+="</div>";

       				
				this.grid = " <table onMouseMove='"+this.objectName+".moveWidth()' onMouseUp='"+this.objectName+".stopMov()'";
				this.grid += "  id='"+this.id+"' class='"+this.id+"' cellpadding=0 cellspacing=0   >";
				this.grid += "   <tr>";
				this.grid += "     <td valign=top>"+HTable+bodyTbl+"</td>";
				this.grid += "   </tr>";
				this.grid += " </table>";

				document.getElementById(this.htmlContainer).innerHTML = this.grid;
				
				
				// ############# Carga tama�o de tabla definido por usuarios ###########################################
				document.getElementById(this.id).style.height 		= this.setTableLayoutHeight+"px";
				document.getElementById(this.id).style.width 		= this.setTableLayoutWidth+"px";
				document.getElementById(this.id+"_body").style.width 		= this.setTableLayoutWidth+"px";
				document.getElementById(this.id+"_body").style.height 		= this.setTableLayoutHeight+"px";
				document.getElementById(this.id+"_header").style.width 	= this.setTableLayoutWidth+"px";
				
				
			} catch (e){
				alert("Error render method : " + e.description)
			}
		}
		
		// ordenamiento de la grilla
		this.sortGrid = function(col,idCell) {
			try{

       
		      var tmp		= new Array();
					var aux 		= "";
					var oMatrix	= this.gridContent;
					var label		= this.setTagNameInColumn;
					var cm			= String.fromCharCode(34);
					var valor		= "";
					
					// "oden" contiene el indice con el nuevo orden para el arreglo
					 var orden	= _jwcgSelectSortingMethod(oMatrix,label[col],this.sortMethod,this.nRows);
					 
					// regenera arreglo JSON
					var newMatrix  = "[";
					
					for(var i=0;i<this.nRows;i++){
						newMatrix  += "{"
						for(var c=0;c<this.nCols;c++){
							valor = eval("oMatrix["+orden[i]+"]."+label[c])
							newMatrix  += cm+label[c]+cm+":"+cm+valor+cm+","
						}
						newMatrix = newMatrix.substring(0,newMatrix.length-1); // saca la ultima coma
						newMatrix +="},"
					}
					newMatrix = newMatrix.substring(0,newMatrix.length-1); // saca la ultima coma
					newMatrix +="];"
					this.gridContent = null; // borro memoria
					this.gridContent = eval(newMatrix) // creo nuevo arreglo JSON
		      this.render();
		      	      
        	document.getElementById("orden_"+idCell).className = "ordenArrowActive"
					
			}catch (e){
				alert("sortGrid :"+e.description)
			}
		}
 		this.setHeaderPosition = function() {
			try{
        // sincroniza el encabezado con el contenido de la grilla al mover el scroll (06-08-2009)
			 document.getElementById(this.id+"_header").scrollLeft = document.getElementById(this.id+"_body").scrollLeft

			}catch (e){
				alert("setHeaderPosition :"+e.description)
			}
	 }
}
