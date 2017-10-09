/*

    File: main.js
    Author: John Desjardins
    
    Version: 1.0
    Date: Oct 08 2017

*/

let HeaderList = React.createClass({
    propTypes: {
    },
    render: function() {
        return(
            React.createElement('div', {className: 'header'},
                React.createElement('h1', {}, 'List of Favourite Films')
            )
        );    
    }
});

let HeaderItems = React.createClass({
    propTypes: {  
    },
    render: function() {
        return(
            React.createElement('div', {className: 'header'},
                React.createElement('h1', {}, 'Film Details')
            )
        );
    }
});

let HeaderAdd = React.createClass({
    propTypes: {  
    },
    render: function() {
        return(
            React.createElement('div', {className: 'header'},
                React.createElement('h1', {}, 'Add Film')
            )
        );
    }
});

let NavMenu = React.createClass({
    render: function() {
        return (
            React.createElement('ul', {className: 'nav-menu'},
                React.createElement('li', {},
                    React.createElement('a', {href: '#'}, 'List of Favourite Films')
                ),
                React.createElement('li', {},
                    React.createElement('a', {href: '#newitem'}, 'Add Film')
                )
            )
        );
    }
});

let List = React.createClass({
    propTypes: {
        id: React.PropTypes.number,
        name: React.PropTypes.string.isRequired,
        year: React.PropTypes.string.isRequired,
        genre: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            React.createElement('li', {},
                React.createElement('a', {className: 'menu-item-link', href: '#/item/' + this.props.id},
                    React.createElement('h2', {className: 'list-item-name'}, this.props.name)
                )
            )
        );
    }
});

let ListItems = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired
    },
    render: function() {
        var listOfItems = this.props.items.map(function(item) {
            return React.createElement(List, item); 
        });
        return (
            React.createElement('ul', {className: 'list-menu'},
                listOfItems
            )
        );
    }
});

let ListPage = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired  
    },
    render: function() {
        return (
            React.createElement('div', {className: 'main-list'},
                React.createElement(HeaderList, {}),
                React.createElement(NavMenu, {}),
                React.createElement(ListItems, {items: this.props.items})
            )
        );
    }
});

let ItemPage = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        year: React.PropTypes.string.isRequired,
        genre: React.PropTypes.string
    },
    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(HeaderItems, {}),
                React.createElement(NavMenu, {}),
                React.createElement('div', {className: 'list-menu'},
                    React.createElement('h2', {className: 'list-name-header'}, this.props.name),
                    React.createElement('p', {}, this.props.year),
                    React.createElement('p', {}, this.props.genre)
                )
            )
        );
    }
});

let AddEntryForm = React.createClass({
    propTypes: {
        listItem: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired
    },
    onNameChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {name: e.target.value}));  
    },
    onYearChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {year: e.target.value}));   
    },
    onGenreChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {genre: e.target.value}));   
    },
    onSubmit: function() {
        if (this.props.listItem.name != '' && this.props.listItem.year != '' && this.props.listItem.genre != '') {
            this.props.onSubmit(this.props.listItem);
        } else {
            alert('All fields are required');
        }
    },
    render: function() {
        return (
        
            React.createElement('form', {},
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Film Name',
                    value: this.props.listItem.name,
                    onChange: this.onNameChange
                }),                  
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Film Year',
                    value: this.props.listItem.year,
                    onChange: this.onYearChange
                }),
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Film Genre',
                    value: this.props.listItem.genre,
                    onChange: this.onGenreChange
                }),
                React.createElement('button', {type: 'button', onClick: this.onSubmit}, 'Add Film')
            )
        );
    }
});

let FormView = React.createClass({
    propTypes: {
        listItem: React.PropTypes.object.isRequired,
        onNewListItemChange: React.PropTypes.func.isRequired,
        onSubmitNewItem: React.PropTypes.func.isRequired
    },
    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(HeaderAdd, {}),
                React.createElement(NavMenu, {}),
                React.createElement('div', {className: 'form'},
                    React.createElement(AddEntryForm, {listItem: this.props.listItem, onChange: this.props.onNewListItemChange, onSubmit: this.props.onSubmitNewItem})
                )
            )
        );
    }
});

let state = {};
let setState = function(changes) {
    let component;
    let Properties = {};
    
    Object.assign(state, changes);
    
    let splittedUrl = state.location.replace(/^#\/?|\/$/g, '').split('/');
    
    switch(splittedUrl[0]) {
    case 'newitem':
        component = FormView;
        Properties = {
            listItem: state.listItem,
            onNewListItemChange: function(item) {
                setState({listItem: item});  
            },
            onSubmitNewItem: function(item) {
                let itemList = state.items;
                const newKey = itemList.length + 1;
                itemList.push(Object.assign({}, {key: newKey, id: newKey}, item));
            }
        };
        break;
    case 'item':
        component = ItemPage;
        Properties = state.items.find(i => i.key == splittedUrl[1]);
        break;
    default:
        component = ListPage;
        Properties = {items: state.items};
    }
    
    let masterElement = React.createElement('div', {className: 'content-area'},
        React.createElement(component, Properties)
    );
    ReactDOM.render(masterElement, document.getElementById('react-app'));
};


window.addEventListener('hashchange', ()=>setState({location: location.hash}));

setState({listItem: {
    name: '',
    year: '',
    genre: ''
}, location: location.hash,
items: items});