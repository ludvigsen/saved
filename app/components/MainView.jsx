var React = require('react');

var SavedForm = require('./SavedForm.jsx');

var MainView = React.createClass({
  render: function(){
    return (
      <div className="MainView">
        <SavedForm />
      </div>
    );
  }
});
module.exports = MainView;
