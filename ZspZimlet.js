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
 * This object works as handler for the zSugar Zimlet Interaction with zimlet is
 * divided into: 
 * 
 * 1) A Panel Icon where Messages or Conversations can be droped.
 *    It also has a context menu when right clicked, and options panel when
 *    single/double clicked. 
 * 2) A Toolbar Button. It works as dropping a Msg/Conv into the Panel Icon. 
 * 3) A Context Menu Button. It works as dropping a Msg/Conv into the Panel Icon.
 * 
 */
function ZspZimletH() {
	this._appName = "zSugar+";
	this._appVersion = "0.1";
	this._appDesc = "Zimbra SugarCRM integration Zimlet";
	this._helpCodes = [ "SUGAR_URL", "LDAP_LOGIN", "INCR_FETCH", "KEEP_ALIVE" ];

}

ZspZimletH.prototype = new DwtDialog;
ZspZimletH.prototype = new ZmZimletBase();
ZspZimletH.prototype.constructor = ZspZimletH;
ZspZimletH.prototype.doubleClicked = function() {
	this._displayConfigDialog();
};
ZspZimletH.prototype.singleClicked = ZspZimletH.prototype.doubleClicked;


ZspZimletH.UI_SIZE_MEDIUM = 1;
ZspZimletH.UI_SIZE_LARGE = 2;

/*******************************************************************************
 * com_irontec_zSugarH.prototype.init
 * 
 * Init the Zimlet.
 * 
 * It adds the zSugar+ button at the end of context menu, just after the View
 * Icon. When this button is clicked, it will callback private _addToSugarCRM
 * function.
 */
ZspZimletH.prototype.init = function() {

	var controller = appCtxt.getCurrentController();
	var menu = controller.getActionMenu();

	// Find the Last Menu Position
	var buttonIndex = 0;
	for ( var i = 0; i < menu.opList.length; i++) {
		if (menu.opList[i] == ZmOperation.CREATE_TASK) {
			buttonIndex = i + 1;
			break;
		}
	}

	// Add a new button
	var menuParams = {
		text : this.getMessage("zsugarplus_addToSugarCRM"),
		tooltip : this.getMessage("zsugarplus_addToSugarCRM_tooltip"),
		index : buttonIndex,
		image : "zsugarplusToolIcon",
		enabled : false
	};

	// When this button is clicked execute callback
	var mi = menu.createMenuItem("SEND_SUGARCRM_MENU", menuParams);
	mi.addSelectionListener(new AjxListener(this, this._exportSelectedMsg, controller));
};

/*******************************************************************************
 * ZspZimletH.prototype.initializeToolbar
 * 
 * This function works as hook for adding or editing main toolbar icons
 * 
 * It adds the zSugar+ button at the end of the toolbar, just after the View
 * Icon. When this button is clicked, it will callback private _addToSugarCRM
 * function.
 * 
 */
ZspZimletH.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {

	if (viewId.lastIndexOf(ZmId.VIEW_CONVLIST) == 0 || viewId.lastIndexOf(ZmId.VIEW_TRAD) == 0) {

		// Get the index of "View" menu so we can display the button after that
		var buttonIndex = 0;
		for ( var i = 0; i < toolbar.opList.length; i++)
			if (toolbar.opList[i] == ZmOperation.VIEW_MENU || toolbar.opList[i] == ZmOperation.ACTIONS_MENU) {
				buttonIndex = i + 1;
				break;
			}

		// Configure Toolbar button
		var buttonParams = {
			text : this.getMessage("zsugarplus_exportToSugarCRM"),
			tooltip : this.getMessage("zsugarplus_exportToSugarCRM_tooltip"),
			index : buttonIndex,
			image : "ZSUGAR-panelIcon",
			enabled : false
		};

		// Creates the button with an id and params containing the button details
		var button = toolbar.createOp("SEND_SUGARCRM_TOOLBAR", buttonParams);
		button.addSelectionListener(new AjxListener(this, this._exportSelectedMsg, controller));
	}
};

/*******************************************************************************
 * ZspZimletH.prototype.doDrop
 * 
 * Callback function for Zimlet Panel Icon
 * 
 * This function works as wrapper for the panel icons. It just get the Message
 * info and request export dialog
 * 
 */
ZspZimletH.prototype.doDrop = function(selected) {
	this._displayExportDialog(selected);
};

/*******************************************************************************
 * ZspZimletH.prototype._createHelpButton
 * 
 * Creates a standar help button with a callback that display related help
 * information
 * 
 */
ZspZimletH.prototype._createHelpButton = function(parent, helpCode) {

	// Configure Help button
	var buttonParams = {
		parent : parent,
		style : DwtLabel.IMAGE_LEFT,
		posStyle : DwtControl.RELATIVE_STYLE,
		className : "ztoolbarbutton helpBtn"
	};

	// Create Button and add Listeners
	helpButton = new DwtButton(buttonParams);
	helpButton.addSelectionListener(new AjxListener(this, this._showHelp, helpCode));
	helpButton.setImage("helpBtn");
	return helpButton;
};

/*******************************************************************************
 * ZspZimletH.prototype._showHelp
 * 
 * Show an informational box with information related to a topic.
 * 
 * @param helpCode
 *            Code of Help topic to show information dialog
 */
ZspZimletH.prototype._showHelp = function(helpCode) {

	/* Check if this code exists */
	if (this._helpCodes.indexOf(helpCode) != -1) {
		/* Create a dialog with extra information */
		dialog = appCtxt.getErrorDialog();
		dialog.getButton(ZmErrorDialog.REPORT_BUTTON).setVisibility(false);
		dialog.setMessage(this.getMessage("zsugarplus_" + helpCode + "_msg"));
		dialog.setDetailString(this.getMessage("zsugarplus_" + helpCode + "_details"));
		dialog.popup();
	}

};

/*******************************************************************************
 * ZspZimletH.prototype._displayConfigDialog
 * 
 * Show the custom configure panel when zimlet panel icon is double-clicked.
 * 
 */
ZspZimletH.prototype._displayConfigDialog = function() {
	/* If we haven't the dialog builded, create for later use */
	if (this._configDlg === undefined)
		this._configDlg = new zsugarplus_configDialog(this);
	this._configDlg.getDialog().popup();
};

ZspZimletH.prototype._exportSelectedMsg = function(controller) {
	this._displayExportDialog(controller.getMsg());
};

/*******************************************************************************
 * ZspZimletH.prototype._displayExportDialog
 * 
 * Show the export dialog when a valid email or conversation is dragged into the
 * zimlet icon or the export button in the toolbar
 * 
 */
ZspZimletH.prototype._displayExportDialog = function(msg) {
	var sugar_url = this.getUserPropertyInfo("zsugarplus_sugarurl").value + '/service/v2/rest.php';
	var sugar_user = this.getUserPropertyInfo("zsugarplus_username").value;
	var sugar_pass = this.getUserPropertyInfo("zsugarplus_password").value;
	if (this.getUserPropertyInfo("zsugarplus_ldapauth").value != "true") {
		sugar_pass = hex_md5(this.getUserPropertyInfo("zsugarplus_password").value);
	}
	this.iscrm = new ironsugar(sugar_url, sugar_user, sugar_pass, this);
	this.iscrm.login();

	/* If we haven't the dialog builded, create for later use */
	if (this._exportDlg)
		this._exportDlg.dispose();
	this._exportDlg = new ZspExportDialog( {
		parent : this
	});
	this._exportDlg.load(msg);
	this._exportDlg.getDialog().popup();
}
