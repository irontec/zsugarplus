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

ZspExportMailTab = function(params) {

	// Set the zimlet handler
	this.zimlet = params.zimlet;

	// Add a new tab to the Export Dialog 
	DwtTabViewPage.call(this, {
		parent : params.parent,
		className : "ZSugarTabPage"+params.ui_size,
		contentTemplate : "com_irontec_zsugarplus.templates.ZspExportMailTab"
	});

	// Set the UI size 
	if (params.ui_scale == ZspZimletH.UI_SIZE_MEDIUM) this.setSize(500, 380);
	if (params.ui_scale == ZspZimletH.UI_SIZE_LARGE) this.setSize(750, 580);

	// Set text and icon to the tab button
	this.buttonId = this.parent.addTab(this.zimlet.getMessage("zsugarplus_emails"), this);
	this.parent.getTabButton(this.buttonId).setImage("Message");

	// Initialize tab attributes
	this.emails = [];
	this.emailcnt = 0;

	return this;
};

ZspExportMailTab.prototype = new DwtTabViewPage;
ZspExportMailTab.prototype.constructor = ZspExportMailTab;
ZspExportMailTab.prototype.toString = function() {
	return "ZspExportMailTab";
};

ZspExportMailTab.prototype.addEmail = function(message) {
	var emailcount = this.emailcnt++;
	var html = [], i = 0;

	/* Create a storage for this msg */
	var msg = {};
	msg.id = emailcount;
	msg.subject = message.subject;
	msg.from = message._addrs.FROM.getArray();
	msg.to = message._addrs.TO.getArray();
	msg.cc = message._addrs.CC.getArray();
	msg.attachments = message._attInfo;
	msg.attselected = message._attInfo;
	msg.fragment = message.fragment;

	if (message.isHtmlMail()) {
		msg.bodyHTML = message.getBodyPart(ZmMimeTable.TEXT_HTML).getContent();
		msg.editMode = Dwt.HTML;
	} else {
		//msg.bodyHTML = message.getTextBodyPart().getContent();
		msg.bodyHTML = message.getBodyPart(ZmMimeTable.TEXT_PLAIN).getContent();
		msg.editMode = Dwt.TEXT;
	}
	this.emails[msg.id] = msg;

	/* Fix the subject length */
	var subject = msg.subject;
	if (subject && subject.length > 50)
		subject = subject.substr(0, 50) + "...";

	/* Create a nice block of info of this mail */
	html[i++] = '<fieldset>';
	html[i++] = '<legend><div class="ImgMessage zsugarplusImg"></div>' + subject + '</legend>';
	html[i++] = '<table class="ZSugarEmailData">';
	for ( var j = 0; j < msg.from.length; j++) {
		html[i++] = '<tr><td><b>From:</b> "' + msg.from[j].dispName + '" &lt;' + msg.from[j].address
				+ '&gt;</td></tr>';
		// this.cbSearchBox.addOption('[FROM] '+msg.from[j].dispName, false,
		// msg.from[j].address);
	}
	for ( var j = 0; j < msg.to.length; j++) {
		html[i++] = '<tr><td><b>To:</b> "' + msg.to[j].dispName + '" &lt;' + msg.to[j].address
				+ '&gt;</td></tr>';
		// this.cbSearchBox.addOption('[TO] '+msg.to[j].dispName, false,
		// msg.to[j].address);
	}
	for ( var j = 0; j < msg.cc.length; j++) {
		html[i++] = '<tr><td><b>CC:</b> "' + msg.cc[j].dispName + '" &lt;' + msg.cc[j].address
				+ '&gt;</td></tr>';
		// this.cbSearchBox.addOption('[CC] '+msg.cc[j].dispName, false,
		// msg.cc[j].address);
	}
	html[i++] = '<tr><td><hr/></td></tr>';
	html[i++] = '<tr><td>' + msg.fragment + '</td></tr>';
	html[i++] = '<tr><td><hr/></td></tr>';
	html[i++] = '<tr><td id="zsugarplus_emailopts_' + msg.id + '">';
	html[i++] = '	<div class="ImgAttachment zsugarplusImg" id="zsugarplus_attachments"></div>';
	html[i++] = '	<div id="zsugarplus_atts_' + msg.id + '" class="zsugarplusImg"></div>';
	html[i++] = '</td></tr>';
	html[i++] = '</table>';
	html[i++] = '</fieldset>';

	/* Add the email block to Email tab contents */
	var div = document.createElement("div");
	div.id = "zsugarplus_emaildata_"+msg.id;
	div.innerHTML = html.join("");
	document.getElementById("zsugarplus_tabcontent_emails").appendChild(div);

	/* Set the selected attachments */
	document.getElementById("zsugarplus_atts_" + msg.id).innerHTML = msg.attselected.length + '/'
			+ msg.attachments.length;

	/* Add buttons to each email */
	var buttonParams = {
		parent : this,
		style : DwtLabel.IMAGE_LEFT,
		posStyle : DwtControl.RELATIVE_STYLE,
		className : "ztoolbarbutton emailOptsBtn"
	};
	var btnEmailOpts4 = new DwtButton(buttonParams);
	btnEmailOpts4.addSelectionListener(new AjxListener(this, this._removeMessage, msg));
	btnEmailOpts4.setToolTipContent(this.parent.zimlet.getMessage("zsugarplus_tt_email_delete"));
	btnEmailOpts4.setImage("JunkMail");
	document.getElementById("zsugarplus_emailopts_" + emailcount).appendChild(btnEmailOpts4.getHtmlElement());
	var btnEmailOpts = new DwtButton(buttonParams);
	btnEmailOpts.addSelectionListener(new AjxListener(this, this._editMessageContent, msg));
	btnEmailOpts.setToolTipContent(this.parent.zimlet.getMessage("zsugarplus_tt_email_edit"));
	btnEmailOpts.setImage("MsgStatusDraft");
	document.getElementById("zsugarplus_emailopts_" + emailcount).appendChild(btnEmailOpts.getHtmlElement());
	var btnEmailOpts2 = new DwtButton(buttonParams);
	btnEmailOpts2.addSelectionListener(new AjxListener(this, this._editMessageDates, msg));
	btnEmailOpts2.setToolTipContent(this.parent.zimlet.getMessage("zsugarplus_tt_email_dates"));
	btnEmailOpts2.setImage("SendLater");
	document.getElementById("zsugarplus_emailopts_" + emailcount).appendChild(btnEmailOpts2.getHtmlElement());
	var btnEmailOpts3 = new DwtButton(buttonParams);
	btnEmailOpts3.addSelectionListener(new AjxListener(this, this._editMessageAttachments, msg));
	btnEmailOpts3.setToolTipContent(this.parent.zimlet.getMessage("zsugarplus_tt_email_atts"));
	btnEmailOpts3.setImage("Attachment");
	document.getElementById("zsugarplus_emailopts_" + emailcount).appendChild(btnEmailOpts3.getHtmlElement());
};


ZspExportMailTab.prototype._editMessageDates = function(msg) {

};

ZspExportMailTab.prototype._editMessageAttachments = function(msg) {

	/* Don't show the dialog if there are no Atts */
	if (msg.attachments.length == 0)
		return;

	/* Create a view to contain all the components */
	var view = new DwtComposite(this.shell);
	view.getHtmlElement().style.overflow = "auto";
	view.setSize(400, 100);
	view.getHtmlElement().innerHTML = AjxTemplate.expand(
			"com_irontec_zsugarplus.templates.attachmentsDialog", {
				zsugarplus : this.parent.zimlet
			});

	/* Create Export Dialog */
	var dlg = this.parent.zimlet._createDialog( {
		title : this.parent.zimlet.getMessage("zsugarplus_attachmentsTitle"),
		view : view,
		standardButtons : [ DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON ]
	});

	/* Add a listener for the OK button */
	dlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, function(msg) {
		msg.attselected = [];
		var table = document.getElementById("zsugarplus_attachments_list");
		for (i = 0; i < table.rows.length; i++) {
			var input = table.rows[i].getElementsByTagName("input")[0];
			if (input.checked)
				msg.attselected.push(msg.attachments[i]);
		}
		/* Set the selected attachments */
		document.getElementById("zsugarplus_atts_" + msg.id).innerHTML = msg.attselected.length + '/'
				+ msg.attachments.length;

		dlg.popdown();
		dlg.dispose();
	}, msg));
	dlg.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(dlg, function(dlg) {
		dlg.popdown();
		dlg.dispose();
	}, dlg));

	/* Get attachments table */
	var table = document.getElementById("zsugarplus_attachments_list");
	while (table.rows.length)
		table.deleteRow(0);

	/* Add the attachment list */
	for ( var i = 0; i < msg.attachments.length; i++) {
		selected = (msg.attselected.indexOf(msg.attachments[i]) != -1);
		var html = [], j = 0;
		html[j++] = '<td><input type="checkbox" ' + ((selected) ? "checked" : "") + '></input></td>';
		html[j++] = '<td>';
		html[j++] = '	<div class="zsugarplusImg Img' + msg.attachments[i].linkIcon + '"></div>';
		html[j++] = msg.attachments[i].label;
		html[j++] = '</td>';

		var tr = table.insertRow(table.rows.length);
		tr.innerHTML = html.join("");
	}

	/* Show the dialog */
	dlg.popup();

};

ZspExportMailTab.prototype._editMessageContent = function(msg) {

	/* Create a view to contain all the components */
	var view = new DwtComposite(this.shell);
	view.getHtmlElement().style.overflow = "auto";
	view.setSize(700, 450);
	view.getHtmlElement().innerHTML = AjxTemplate.expand("com_irontec_zsugarplus.templates.messageDialog", {
		zsugarplus : this.parent.zimlet
	});

	/* Create Export Dialog */
	var dlg = this.parent.zimlet._createDialog( {
		title : this.parent.zimlet.getMessage("zsugarplus_editMessageTitle"),
		view : view,
		standardButtons : [ DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON ]
	});

	/* Add a listener for the OK button */
	dlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, function(msg) {
		dlg.popdown();
		dlg.dispose();
	}, msg));
	dlg.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(dlg, function(dlg) {
		dlg.popdown();
		dlg.dispose();
	}, dlg));

	/* Create an editor for Body contentes */
	var dwtext = new ZmHtmlEditor(dlg, Dwt.RELATIVE_STYLE, msg.bodyHTML, msg.editMode, false);
	dwtext.setSize(700, 420);
	document.getElementById('zsugarplus_message_body').appendChild(dwtext.getHtmlElement());

	/* Add the subject to the inputbox */
	document.getElementById('zsugarplus_message_subject').setAttribute("value", msg.subject);

	/* Show the dialog */
	dlg.popup();

};

ZspExportMailTab.prototype._removeMessage = function (msg) {
	try {
	var confirmDlg = new DwtConfirmDialog(this.shell);
	} catch (e){ console.log(e); }
	confirmDlg.popup("Are you sure you want to remove this mail?", new AjxCallback(this, function(){ 
		this.emailcnt--;
		var div = document.getElementById("zsugarplus_emaildata_"+msg.id);
		document.getElementById("zsugarplus_tabcontent_emails").removeChild(div);
//		if (!this.emailcnt) this.parent.dlg.dispose();
	}));
};
