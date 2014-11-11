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

ZspExportSearchTab = function(params) {

	// Set the zimlet handler
	this.zimlet = params.zimlet;
	
	// Add a new tab to the Export Dialog 
	DwtTabViewPage.call(this, {
		parent : params.parent,
		className : "ZSugarTabPage",
		contentTemplate : "com_irontec_zsugarplus.templates.ZspExportSearchTab"
	});

	// Set the UI size 
	//if (params.ui_scale == ZspZimletH.UI_SIZE_MEDIUM) this.setSize("500", "380");
	//if (params.ui_scale == ZspZimletH.UI_SIZE_LARGE) this.setSize("750", "580");
	
	// Set text and icon to the tab button
	this.buttonId = params.parent.addTab(this.zimlet.getMessage("zsugarplus_relations"), this);
	params.parent.getTabButton(this.buttonId).setImage("Group");

	// Add Elements to Search group
	this.cbSearchBox = new DwtSelect({ parent : this });
	this.cbSearchBox.dynamicButtonWidth();
	this.cbSearchBox.addChangeListener(new AjxListener(this, this._changeSearchBy));
	this.cbSearchBox.setText('');
	this.inSearchBox = new DwtInputField({ parent : this, size : 30 });
	this.btnSearch = new DwtButton({ parent : this });
	this.btnSearch.addSelectionListener(new AjxListener(this, this._searchEmail));
	this.btnSearch.setImage("Search2");
	this.btnSearch.setText(this.zimlet.getMessage("zsugarplus_search"));
	document.getElementById("zsugarplus_cbSearchBox").appendChild(this.cbSearchBox.getHtmlElement());
	document.getElementById("zsugarplus_inSearchBox").appendChild(this.inSearchBox.getHtmlElement());
	document.getElementById("zsugarplus_btnSearch").appendChild(this.btnSearch.getHtmlElement());

	this.resultView = new DwtTree( { parent : this, className : "DwtTree ZSugarResults" });
	this.resultView.getHtmlElement().style.overflowY = "auto";
	this.resultView.getHtmlElement().style.overflowX = "hidden";
	this.resultView.setSize(480, 160);
	
	document.getElementById("zsugarplus_results").appendChild(this.resultView.getHtmlElement());

	this.selectedView = new DwtTree( {
		parent : this,
		className : "DwtTree ZSugarResults"
	});
	this.selectedView.getHtmlElement().style.overflowY = "auto";
	this.selectedView.getHtmlElement().style.overflowX = "hidden";
	this.selectedView.setSize(480, 120);

	document.getElementById("zsugarplus_selected").appendChild(this.selectedView.getHtmlElement());
	this.dragSource = new DwtDragSource(Dwt.DND_DROP_MOVE);
	this.dragSource.addDragListener(new AjxListener(this, function(ev) {
		ev.srcData = ev.srcControl;
	}));
	this.dropTarget = new DwtDropTarget(DwtTreeItem);
	this.selectedView.setDropTarget(this.dropTarget);
	this.dropTarget.addDropListener(new AjxListener(this, function(ev) {
		if (ev.action == DwtDropEvent.DRAG_DROP) {
			this._addRelation(ev.srcData);
		}
	}));

	return this;
};

ZspExportSearchTab.prototype = new DwtTabViewPage;
ZspExportSearchTab.prototype.constructor = ZspExportSearchTab;
ZspExportSearchTab.prototype.toString = function() {
	return "ZspExportSearchTab";
};

ZspExportSearchTab.prototype._searchEmail = function() {

	this.resultView.clearItems();
	var email = this.inSearchBox.getValue();
	this.parent.zimlet.iscrm.getContactsFromMail(email, new AjxCallback(this, this._parseSearchResults));
};

ZspExportSearchTab.prototype._parseSearchResults = function(data) {
	for ( var i = 0; i < data.entry_list.length; i++) {
		var result = {};
		result.id = data.entry_list[i].id;
		result.type = data.entry_list[i].module_name;
		result.name = data.entry_list[i].name_value_list.first_name.value;
		this._addResult(result);
	}
};

ZspExportSearchTab.prototype._changeSearchBy = function() {
	this.cbSearchBox.setText('');
	this.inSearchBox.setValue(this.cbSearchBox.getSelectedOption().getValue());
};

ZspExportSearchTab.prototype._addResult = function(result) {
	var parent = this.resultView;
	var items = this.resultView.getItems();
	if (result.parent) {
		for ( var i = 0; i < items.length; i++) {
			if (items[i].getHTMLElId() == result.parent) {
				parent = items[i];
				break;
			}
		}
	}

	var item = new DwtTreeItem( {
		parent : parent,
		text : result.name,
		id : result.id,
		imageInfo : "Sugar" + result.type
	});

	item.addListener(DwtEvent.ONDBLCLICK, new AjxListener(this, this._addRelation, item));
	item.setDragSource(this.dragSource);

};

ZspExportSearchTab.prototype._addRelation = function(treeItem) {

	var items = this.selectedView.getItems();
	for ( var i = 0; i < items.length; i++) {
		if (items[i].getHTMLElId() == "relation_" + treeItem.getHTMLElId())
			return;
	}

	var item = new DwtTreeItem( {
		parent : this.selectedView,
		text : treeItem.getText(),
		imageInfo : treeItem.getImage(),
		id : "relation_" + treeItem.getHTMLElId(),
		extraInfo : "DownArrowSmall"
	});
	item.menu = new DwtMenu( {
		parent : item,
		style : DwtMenu.DROPDOWN_STYLE
	});
	var menuitem = DwtMenuItem.create( {
		parent : item.menu,
		imageInfo : "Minus",
		text : this.parent.zimlet.getMessage("zsugar_remove_relation")
	});
	menuitem.addSelectionListener(new AjxListener(item.parent, item.parent.removeChild, item));
	var menuitem2 = DwtMenuItem.create( {
		parent : item.menu,
		imageInfo : "Minus",
		text : this.zimlet.getMessage("zsugar_remove_relation")
	});
	var menu2 = new DwtMenu( {
		parent : menuitem2
	});
	menuitem2.setMenu(menu2);
	DwtMenuItem.create( {
		parent : menu2,
		style : DwtMenuItem.RADIO_STYLE,
		text : this.zimlet.getMessage("zsugar_remove_relation")
	});
	DwtMenuItem.create( {
		parent : menu2,
		style : DwtMenuItem.RADIO_STYLE,
		text : this.zimlet.getMessage("zsugar_remove_relation")
	});
	DwtMenuItem.create( {
		parent : menu2,
		style : DwtMenuItem.RADIO_STYLE,
		text : this.zimlet.getMessage("zsugar_remove_relation")
	});

	item.addListener(DwtEvent.ONMOUSEUP, new AjxListener(this, function(item, ev) {
		item.menu.popup(100, ev.docX, ev.docY, false);
	}, item));

}


ZspExportDialog.prototype._relationsTest = function() {
    this._addResult( {
        id : "48a1c956460094a2ba9f243d95c92e2b",
        type : "Contact",
        name : "Contact 1"
    });
    this._addResult( {
        id : "1754a5c90c8aafa005680ef36903fa5f",
        type : "Contact",
        name : "Contact 2"
    });
    this._addResult( {
        id : "be4256fd5da19538f5b6f75d5893a7c4",
        type : "Contact",
        name : "Contact 3"
    });
    this._addResult( {
        id : "23a9ebe3ca8e1f8d0c6ab8e3c04a5ca8",
        parent : "48a1c956460094a2ba9f243d95c92e2b",
        type : "Opportunity",
        name : "This is an oportunity"
    });
    this._addResult( {
        id : "691805e85e96af67d67b1ce6a378391d",
        parent : "1754a5c90c8aafa005680ef36903fa5f",
        type : "Opportunity",
        name : "And this is another"
    });
    this._addResult( {
        id : "020a873ebfe66ed58217b7d912a7f4ce",
        parent : "48a1c956460094a2ba9f243d95c92e2b",
        type : "Project",
        name : "Super project is here for all"
    });
    this._addResult( {
        id : "020a873ebfe66ed58217b7d912a7f4cf",
        type : "Lead",
        name : "Lead client"
    });
    this._addResult( {
        id : "e237f44197dbbc89c2da71706b521648",
        parent : "48a1c956460094a2ba9f243d95c92e2b",
        type : "Account",
        name : "And super account too!"
    });
}

