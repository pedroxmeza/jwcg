//*****************************************************************************************
//    Javascript Web Control Grid es una clase para crear tablas dinamicas
//    Copyright © 2008, 2009  Pedro Meza A.
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
# Manejo de Seleccion de celdas de la tabla
##############################################
*/

webControlGrid.prototype.turnOn = function (cell) {
	 try {
  		if (this.enabledRollOver	== true) {
  			var newColor           = this.activeRowColor;
  			this.auxActiveRowColor = cell.style.backgroundColor;
  
  			var row = cell.parentNode;
  			var fila = row.cells;  // entrego lista de celdas dentro de la fila
  			// recorro cada celda y aplico nuevo color
  			var startloop=(this.countCol)?1:0;
  			for( var i=startloop;i< fila.length;i++){ 
  				fila[i].style.backgroundColor = newColor;
  			}
  		}
 	} catch(e) {
		alert("Error turnOn:"+e.description)
	}
}

webControlGrid.prototype.turnOff = function (cell) {
	 try {
  		if (this.enabledRollOver	== true) {
    		if (cell.id != this.idCellSelected ) { 
    			var newColor           = this.auxActiveRowColor;
    			this.auxActiveRowColor = "";
    
    			var row = cell.parentNode;
    			var fila = row.cells;  // entrego lista de celdas dentro de la fila
    			var startloop=(this.countCol)?1:0;
    			for(var i=startloop;i< fila.length;i++){ // recorro cada celda
    				fila[i].style.backgroundColor = newColor;
    			}
    		}
  		}
 	} catch(e) {
		alert("Error turnOff:"+e.description)
	}
}

webControlGrid.prototype.clickMe = function (cell,functionName) {
try {
    if (this.enabledRollOver	== true) {
      if (this.idCellSelected!=cell.id) {
				if (this.idCellSelected!="" ) {
				  var sCell  = document.getElementById(this.idCellSelected)
					var row    = sCell.parentNode
					var fila   = row.cells;
					var startloop=(this.countCol)?1:0;
					for(var i=startloop;i< fila.length;i++){ 
					    fila[i].style.backgroundColor = this.bgCellSelected;
					}
				}
			}
    }
   
    this.idCellSelected = cell.id; 
    this.bgCellSelected = this.auxActiveRowColor;
    
		if(functionName!="") {
			var func = functionName + "('"+this.idCellSelected+"')";
			var llamada= new Function(func);
			llamada(); 
		}
	} catch(e) {
		alert("Error ClickMe:"+e.description)
	}
}

