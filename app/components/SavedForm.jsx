var React = require('react');

var SavedForm = React.createClass({
  getInitialState: ()=>{
    return {saved: 0};
  },
  handleClick: function(event) {
    console.log('handleClick', this.state.saved);
  },
  handleInputChange: function(e){
   this.setState({saved: e.target.value});
  },
  render: function(){
    return (
      <div className="SavedForm">
        <input type="text" onChange={this.handleInputChange} placeholder="Saved"></input>
        <button onClick={this.handleClick}>Saved</button>
      </div>
    );
  }
});
module.exports = SavedForm;
