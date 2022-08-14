import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
  

class Note extends React.Component {
    

    render() {
      return (
        
        // html
        <div>
            <h3>
                {this.props.title}
            </h3> 
            <p>
                {this.props.text}
            </p>
        </div>

        );
    }
  }
  
  class NoteCollector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes : [], // empty array which gets filled with notes
            arraylength : 0,
            newtitle : '',
            newtext : ''
            
            
        };
        // form submitting events
        this.handletitlechange = this.handletitlechange.bind(this);
        this.handletextechange = this.handletextchange.bind(this);
        this.handlesubmit = this.handlesubmit.bind(this);

      }
      

    addnote(title, text) {
        // resets the inputs
        this.setState({newtext : ''});
        this.setState({newtitle : ''});
        // simple console.log
        console.log("added note: " + this.state.notes.length);
        // creates and updates an array, same as array.concat but that didnt seem to work
        var updatedarray = this.state.notes;
        updatedarray.push({title: title, text: text, key : null, isediting:false,});
        // sets the state of notes to the updated array so it updates the list of notes
        this.setState({notes: updatedarray});
        // corrects the key of the notes
        this.updatenoteindexes()

    }
    // removes the object with the corresponding key from the notes array to prevent it from being rendered
    removenote(key) {
        // updates array
        var updatedarray = this.state.notes
        updatedarray.splice(key, 1);
        this.setState({notes: updatedarray});
        console.log("removed note: " + key);
        this.updatenoteindexes();
    }
    // todo
    editnote(key) {
        // toggles the editing state
        updatedarray = this.state.notes;
        if (this.state.notes[key]["isediting"] == false) {
            updatedarray[key]["isediting"] = true;
            this.setState({notes : updatedarray});
        }
        else {
            updatedarray[key]["isediting"] = false;
            this.setState({notes : updatedarray});
        }
    }
    // loops through the entire notes array and updates the key value to be in order to prevent bugs when deleting notes
    updatenoteindexes() {
        var index = 0;
        var updatedarray = [];
        for (let i = 0; i < this.state.notes.length; i++) {
            var note = this.state.notes[i];
            note["key"] = index;
            updatedarray.push(note);
            index += 1;
            
        }
        this.setState({notes : updatedarray});
    }
    // simple debug function that lists all notes in the notes array
    listallnotes() {
        this.state.notes.forEach(note => {
            console.log(note);
        });
    }


    // functions for the form
    handlesubmit(event) {
        this.addnote(this.state.newtitle, this.state.newtext);
        // prevents the reloading of the site
        event.preventDefault();
        
    }
    // both functions get called when the value of their input changes
    handletitlechange(event) {
        this.setState({newtitle : event.target.value});
    }
    handletextchange(event) {
        this.setState({newtext : event.target.value});
    }
    // render function, the heart of the class
    render() {
      return (
        // html
        <div>
            
            {this.state.notes.map(({title, text, key}) => (
            <div id= "note" key={key}>
                <Note title = {title} text = {text}/>
                <button onClick={ () => {this.editnote(key);}}>Edit</button>
                <button onClick={ () => {this.removenote(key);}}>X</button>
            </div>
            
            ))}
            
            
            <div id="addnote">
                <form onSubmit={this.handlesubmit}>
                    <label>
                    Title
                    <input type="text" value={this.state.newtitle} onChange={this.handletitlechange} />
                    </label>
                    <label>
                    Text
                    <input type="text" value={this.state.newtext} onChange={this.handletextechange} />
                    </label>
                    <input type="submit" value="Add" />
                </form>
                
            </div>
        </div>

        );
    } 
  }



// program initialize
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<NoteCollector/>);

