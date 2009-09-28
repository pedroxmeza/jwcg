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

/*##########################################
# Manejo de anchos dinamicos de la tabla
###########################################*/


webControlGrid.prototype.startMov = function (hCol,col,nRows) {
	 try {
  	  this.XmouseStartPos	= this.XMouseXPos;
  		this.SelectColumn		= col;
  		this.SelectHColumn	= hCol;
  		this.ScNrows				= nRows;
  		this.WidthOrig			= parseInt(String(document.getElementById(hCol).style.width));
  		this.StatusMov			= true;

 	} catch(e) {
		alert("Error startMov:"+e.description)
	}
}

webControlGrid.prototype.stopMov = function () {
	 try {

	 	this.XmouseStartPos	= 0;
		this.SelectColumn		= null;
		this.SelectHColumn	= null;
		this.ScNrows					= 0;
		this.StatusMov			= false;
		
 	} catch(e) {
		alert("Error stopMov:"+e.description)
	}
}


webControlGrid.prototype.moveWidth = function () {
	 try {
	   
		if (this.StatusMov){
			var xMousePosActual		= this.XMouseXPos;
			var move							= xMousePosActual-this.XmouseStartPos;
			var newWidth					= this.WidthOrig + (1 * move);
			var oHCol						  = document.getElementById(this.SelectHColumn);
			var oCol							= null;
			
			
		// ## mueve newWidth, al arreglo de anchos ###################################################
			var script						= "";
			var columna 					= this.SelectHColumn.substring(this.SelectHColumn.length-2,this.SelectHColumn.length-1);
			script+= "if ("+this.objectName+".setSizeColumn) {";
			script+= this.objectName+".setSizeColumn["+columna+"] = '"+newWidth.toString()+"'";
			script+="} ";
			setTimeout(script,0);
			script								="";
		//  ##########################################################################################
		
			if (newWidth > 0){
				for(var i=0;i<this.ScNrows;i++){
					oCol							  = document.getElementById(this.SelectColumn.replace(/y0/g,"y"+i));
					if (oCol) {
						oCol.style.width	= newWidth.toString()+"px";
					} 
				}
				oHCol.style.width		= newWidth.toString()+"px";
			}
		}

 	} catch(e) {
		alert("Error moveWidth:"+e.description)
	}
}
                                    
