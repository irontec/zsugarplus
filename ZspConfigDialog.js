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
/*******************************************************************************
 * zsugarplus_configDialog
 * 
 * This object manages the configuration dialog of zsugarplus zimlet Includes a
 * DwtCompnent and DwtDialog to manage the useractions.
 * 
 */

function zsugarplus_configDialog(parent) {
	this.zimlet = parent;

	// Create a view to contain all the components
	this.view = new DwtComposite(this.zimlet.getShell());
	this.view.setSize(500, 400);
	this.view.getHtmlElement().innerHTML = AjxTemplate.expand("com_irontec_zsugarplus.templates.ZspConfigDialog", {
		zsugarplus : this.zimlet
	});

	// Add help Buttons for required fields
	btnUrlHelp = this.zimlet._createHelpButton(this.view, "SUGAR_URL");
	document.getElementById("zsugarplus_sugarurlhelp").appendChild(btnUrlHelp.getHtmlElement());
	btnLdapHelp = this.zimlet._createHelpButton(this.view, "LDAP_LOGIN");
	document.getElementById("zsugarplus_ldapauthhelp").appendChild(btnLdapHelp.getHtmlElement());
	btnIncrFetchHelp = this.zimlet._createHelpButton(this.view, "INCR_FETCH");
	document.getElementById("zsugarplus_incrfetchhelp").appendChild(btnIncrFetchHelp.getHtmlElement());
	btnKeepAliveHelp = this.zimlet._createHelpButton(this.view, "KEEP_ALIVE");
	document.getElementById("zsugarplus_keepalivehelp").appendChild(btnKeepAliveHelp.getHtmlElement());

	// Add a button to check the configuration
	btnCheckConfig = new DwtButton(this.view);
	btnCheckConfig.setText(this.zimlet.getMessage("zsugarplus_checkconfig"));
	btnCheckConfig.addSelectionListener(new AjxListener(this, this._checkConfig));
	document.getElementById("zsugarplus_checkconfig").appendChild(btnCheckConfig.getHtmlElement());

	this.cbUISize = new DwtSelect( {
		parent : this.view,
		options : [
				new DwtSelectOption(ZspZimletH.UI_SIZE_MEDIUM, false, this.zimlet.getMessage("zsugarplus_ui_medium")),
				new DwtSelectOption(ZspZimletH.UI_SIZE_LARGE, false, this.zimlet.getMessage("zsugarplus_ui_large")) ]
	});
	document.getElementById("zsugarplus_ui_size").appendChild(this.cbUISize.getHtmlElement());

	this.cbIniTab = new DwtSelect( {
		parent : this.view,
		options : [
				new DwtSelectOption(ZspExportDialog.MAIL_TAB, false, this.zimlet.getMessage("zsugarplus_emails")),
				new DwtSelectOption(ZspExportDialog.SEARCH_TAB, false, this.zimlet.getMessage("zsugarplus_relations")),
				new DwtSelectOption(ZspExportDialog.SUGAR_TAB, false, this.zimlet.getMessage("zsugarplus_newobjects")),
				new DwtSelectOption(ZspExportDialog.OPTIONS_TAB, false, this.zimlet
						.getMessage("zsugarplus_otheroptions")), ]
	});
	document.getElementById("zsugarplus_initab").appendChild(this.cbIniTab.getHtmlElement());

	this.cbImportConv = new DwtSelect( {
		parent : this.view,
		options : [
				new DwtSelectOption(ZspExportDialog.IMPORT_CONV_ALL, false, this.zimlet
						.getMessage("zsugarplus_importconv_all")),
				new DwtSelectOption(ZspExportDialog.IMPORT_CONV_FIRST, false, this.zimlet
						.getMessage("zsugarplus_importconv_first")),
				new DwtSelectOption(ZspExportDialog.IMPORT_CONV_ASK, false, this.zimlet
						.getMessage("zsugarplus_importconv_ask")), ]
	});
	document.getElementById("zsugarplus_importconv").appendChild(this.cbImportConv.getHtmlElement());

	// Create Configuration Dialog
	this.dlg = this.zimlet._createDialog( {
		title : this.zimlet.getMessage("zsugarplus_preferencesTitle"),
		view : this.view,
		standardButtons : [ DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON ]
	});
	this.dlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._saveConfig));

	// Load User properties into fields
	this._loadConfig();
};

zsugarplus_configDialog.prototype._checkConfig = function() {
};

zsugarplus_configDialog.prototype.getDialog = function() {
	return this.dlg;
};

zsugarplus_configDialog.prototype._loadConfig = function() {

	var z = this.zimlet;

	// Get Preferences for dialog values
	document.getElementById("zsugarplus_username").value = z.getUserProperty("zsugarplus_username");
	document.getElementById("zsugarplus_password").value = z.getUserProperty("zsugarplus_password");
	document.getElementById("zsugarplus_sugarurl").value = z.getUserProperty("zsugarplus_sugarurl");
	document.getElementById("zsugarplus_ldapauth").checked = (z.getUserProperty("zsugarplus_ldapauth")) ? 'checked'
			: '';
	document.getElementById("zsugarplus_accounts").checked = (z.getUserProperty("zsugarplus_accounts")) ? 'checked'
			: '';
	document.getElementById("zsugarplus_projects").checked = (z.getUserProperty("zsugarplus_projects")) ? 'checked'
			: '';
	document.getElementById("zsugarplus_opportunities").checked = (z.getUserProperty("zsugarplus_opportunities")) ? 'checked'
			: '';
	document.getElementById("zsugarplus_cases").checked = (z.getUserProperty("zsugarplus_cases")) ? 'checked' : '';
	document.getElementById("zsugarplus_leads").checked = (z.getUserProperty("zsugarplus_leads")) ? 'checked' : '';
	document.getElementById("zsugarplus_autosearch").checked = (z.getUserProperty("zsugarplus_autosearch")) ? 'checked'
			: '';
	document.getElementById("zsugarplus_incrfetch").checked = (z.getUserProperty("zsugarplus_incrfetch")) ? 'checked'
			: '';
	document.getElementById("zsugarplus_keepalive").checked = (z.getUserProperty("zsugarplus_keepalive")) ? 'checked'
			: '';
	this.cbUISize.setSelectedValue(z.getUserProperty("zsugarplus_ui_size"));
	this.cbIniTab.setSelectedValue(z.getUserProperty("zsugarplus_initab"));
	this.cbImportConv.setSelectedValue(z.getUserProperty("zsugarplus_importconv"));
};

zsugarplus_configDialog.prototype._saveConfig = function() {

	var z = this.zimlet;

	// Set Preferences from dialog values
	z.setUserProperty("zsugarplus_username", document.getElementById("zsugarplus_username").value);
	z.setUserProperty("zsugarplus_password", document.getElementById("zsugarplus_password").value);
	z.setUserProperty("zsugarplus_sugarurl", document.getElementById("zsugarplus_sugarurl").value);
	z.setUserProperty("zsugarplus_ldapauth", document.getElementById("zsugarplus_ldapauth").checked);
	z.setUserProperty("zsugarplus_accounts", document.getElementById("zsugarplus_accounts").checked);
	z.setUserProperty("zsugarplus_projects", document.getElementById("zsugarplus_projects").checked);
	z.setUserProperty("zsugarplus_opportunities", document.getElementById("zsugarplus_opportunities").checked);
	z.setUserProperty("zsugarplus_cases", document.getElementById("zsugarplus_cases").checked);
	z.setUserProperty("zsugarplus_leads", document.getElementById("zsugarplus_leads").checked);
	z.setUserProperty("zsugarplus_autosearch", document.getElementById("zsugarplus_autosearch").checked);
	z.setUserProperty("zsugarplus_incrfetch", document.getElementById("zsugarplus_incrfetch").checked);
	z.setUserProperty("zsugarplus_keepalive", document.getElementById("zsugarplus_keepalive").checked);
	z.setUserProperty("zsugarplus_ui_size", this.cbUISize.getValue());
	z.setUserProperty("zsugarplus_initab", this.cbIniTab.getValue());
	z.setUserProperty("zsugarplus_importconv", this.cbImportConv.getValue());

	/* Save Preferences */
	z.saveUserProperties();

	appCtxt.getAppController().setStatusMsg(z.getMessage("zsugarplus_preferencesSaved"), ZmStatusView.LEVEL_INFO);
	this.dlg.popdown(); // hide the dialog
};
