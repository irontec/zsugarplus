/*******************************************************************************
 * 
 * Copyright (C) 2013 Irontec SL. All rights reserved.
 * 
 * This file may be used under the terms of the GNU General Public License
 * version 3.0 as published by the Free Software Foundation and appearing in the
 * file LICENSE.GPL included in the packaging of this file. Please review the
 * following information to ensure GNU General Public Licensing requirements
 * will be met:
 * 
 * This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
 * WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 * 
 ******************************************************************************/

ZspExportDialog = function(params) {
	if (arguments.length == 0) {
		return;
	}

	// Store the zimlet
	this.zimlet = params.parent;
	this.scaleClass =  "ZSugarUISize"+ this.zimlet.getUserProperty("zsugarplus_ui_size");

	// FIXME Create a view to contain all the components
	this.view = new DwtComposite({
				parent: this.zimlet.getShell(),
				className: [ "ZSugarExportDialog", this.scaleClass ].join(" ")
	});
	
	//this.view.getHtmlElement().style.overflow = "auto";

	// Set the UI size 
	this._ui_scale = this.zimlet.getUserProperty("zsugarplus_ui_size");
	if (this._ui_scale == ZspZimletH.UI_SIZE_MEDIUM)
		this.view.setSize(500, 400);
	if (this._ui_scale == ZspZimletH.UI_SIZE_LARGE)
		this.view.setSize(750, 600);

	// Create a TabView
	DwtTabView.call(this, {
		parent : this.view,
		className : [ "ZSugarTabView", "ZOptionsSectionTabView",this.scaleClass ].join(" ")
	});

	// Create available tabs
	this.emailsTab = new ZspExportMailTab({ parent: this , zimlet: this.zimlet , ui_scale: this._ui_scale});
	this.searchTab = new ZspExportSearchTab({ parent: this , zimlet: this.zimlet , ui_scale: this._ui_scale});
	this.sugarTab = new ZspExportSugarTab({ parent: this , zimlet: this.zimlet });
	this.optionsTab = new ZspExportOptionsTab({ parent: this , zimlet: this.zimlet });

	/* Create Export Dialog */
	this.dlg = this.zimlet._createDialog( {
		title : this.zimlet.getMessage("zsugarplus_exportTitle"),
		view : this.view,
		standardButtons : [ DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON ]
	});
	this.dlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._doExport));
	return this;
};

ZspExportDialog.MAIL_TAB = 1;
ZspExportDialog.SEARCH_TAB = 2;
ZspExportDialog.SUGAR_TAB = 3;
ZspExportDialog.OPTIONS_TAB = 4;

ZspExportDialog.IMPORT_CONV_ALL = 1;
ZspExportDialog.IMPORT_CONV_FIRST = 2;
ZspExportDialog.IMPORT_CONV_ASK = 3;

ZspExportDialog.prototype = new DwtTabView;
ZspExportDialog.prototype.constructor = ZspExportDialog;
ZspExportDialog.prototype.getDialog = function() {
	return this.dlg;
};

ZspExportDialog.prototype.load = function(selected) {
	/* FIXME Fixme recursive :] */
	if (selected instanceof Array) {
		for ( var i = 0; i < selected.length; i++) {
			this.emailsTab.addEmail(selected[i].srcObj);
		}
	} else if (selected instanceof ZmMailMsg) {
		this.emailsTab.addEmail(selected);
	} else if (selected.srcObj.type == "MSG") {
		this.emailsTab.addEmail(selected.srcObj);
	} else if (selected.srcObj.type == "CONV") {
		console.log(selected);
	}
}

ZspExportDialog.prototype._doExport = function() {

}
