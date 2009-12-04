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
# Manejo de Paginacion de la tabla
###########################################*/


webControlGrid.prototype.nextPage = function () {
  try {
    this.currentPage++;
    var npages = this.rowsInPage * this.currentPage;
    if (this.nRows < npages) {
         this.currentPage--;
    } else {
      this.render ()}
  } catch (e) {
    alert ("Error nextPage:" + e.description)}
}

webControlGrid.prototype.prevPage = function () {
  try {
    this.currentPage--;
    if (this.currentPage < 0) {
	    this.currentPage = 0;
    } else {
	    this.render ();
   }
  } catch (e) {
  alert ("Error nextPage:" + e.description)}
}

webControlGrid.prototype.gotoPage = function (page) {
  try {
    if (page >= 0) {
	   var npages = this.rowsInPage * page;
	   if (this.nRows > npages) {
	    this.currentPage = page;
	    this.render ();
	   } 
    }
  } catch (e) {
  alert ("Error nextPage:" + e.description)}
}

webControlGrid.prototype.getIndexPagination = function () {
  try {
    var indexPage = "";
    var countIndx = 0;
    largo = this.nRows / this.rowsInPage;
    for (var i = 0; i < largo; i++) {
	   indexPage += String (i) + ";";
    }
    indexPage = indexPage.substring (0, indexPage.length - 1);
    return indexPage.split (";");
  } catch (e) {
    alert ("Error getIndexPagination:" + e.description)
  }
}
