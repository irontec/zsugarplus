/****************************************************************************
 **
 ** Copyright (C) 2013 Irontec SL. All rights reserved.
 **
 ** This file may be used under the terms of the GNU General Public
 ** License version 3.0 as published by the Free Software Foundation
 ** and appearing in the file LICENSE.GPL included in the packaging of
 ** this file.  Please review the following information to ensure GNU
 ** General Public Licensing requirements will be met:
 **
 ** This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
 ** WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 **
 ****************************************************************************/

ZspExportOptionsTab = function(params) {

    this.zimlet = params.zimlet;

	DwtTabViewPage.call(this, {
		parent : params.parent,
		className : "ZSugarTabPage",
		contentTemplate : "com_irontec_zsugarplus.templates.tabOptions"
	});
	
	this.buttonId = params.parent.addTab(params.zimlet.getMessage("zsugarplus_otheroptions"), this);
	params.parent.getTabButton(this.buttonId).setImage("Preferences");
	return this;
}

ZspExportOptionsTab.prototype = new DwtTabViewPage;
ZspExportOptionsTab.prototype.constructor = ZspExportOptionsTab;
ZspExportOptionsTab.prototype.toString = function() {
	return "ZspExportOptionsTab";
}
