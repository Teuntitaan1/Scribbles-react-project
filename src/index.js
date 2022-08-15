import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Cookies from 'js-cookie';
// simple note component
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
  // center note collector that manages the whole program
  class NoteCollector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes : this.readnotes(), // empty array which gets filled with notes
            arraylength : 0,
            newtitle : '',
            newtext : '',    
            // to get the date
            date : new Date(),
            // add more colors
            randomcolor : 
            [
                "blue",
                "orange",
                "yellow",
                "green",
                "lightblue"
            ]
        };
        // add form submitting events
        this.handletitlechange = this.handletitlechange.bind(this);
        this.handletextechange = this.handletextchange.bind(this);
        this.handlesubmit = this.handlesubmit.bind(this);
        // reads the cookie
      }
      
      readnotes() {
        var savednotes = Cookies.get("notes");
        if (savednotes === undefined) {
            return [];
        }
        return JSON.parse(savednotes);
      }
    addnote(title, text) {
        // resets the inputs
        this.setState({newtext : ''});
        this.setState({newtitle : ''});
        // simple console.log
        console.log("added note: " + this.state.notes.length);
        // creates and updates an array, same as array.concat but that didnt seem to work
        var updatedarray = this.state.notes;
        var dateobject = this.state.date;
        // i fucking hate dates in javascript
        var date = new Date(dateobject.getFullYear(), dateobject.getMonth(), dateobject.getDate(), dateobject.getHours(), dateobject.getMinutes(), dateobject.getSeconds()).toLocaleString();
        updatedarray.push
        (
            {
                title: title,
                text: text,
                key : null, 
                color : this.generaterandomcolor(),
                datecreated : date

            }
        );
        // sets the state of notes to the updated array so it updates the list of notes
        this.setState({notes: updatedarray});
        // corrects the key of the notes
        this.updatenoteindexes();
        this.updatecookie();

    }
    // updates the date object in the state array
    componentDidMount() {
        setInterval(() => {
            this.setState({date : new Date()});
        }, 1000);
    }

    
    // removes the object with the corresponding key from the notes array to prevent it from being rendered
    removenote(key) {
        // updates array
        var updatedarray = this.state.notes;
        updatedarray.splice(key, 1);
        this.setState({notes: updatedarray});
        console.log("removed note: " + key);
        this.updatenoteindexes();
        this.updatecookie();
    }
    // use this when the notes array changes
    updatecookie() {
        Cookies.set("notes", JSON.stringify(this.state.notes), {expires : 9999});
        console.log("updated cookie to " + this.state.notes);
    }
    clearallnotes() {
        var updatedarray = this.state.notes;
        updatedarray = [];
        this.setState({notes: updatedarray});
        console.log(this.state.notes);
        // the cookie only updates when you run this function twice!?
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
    // returns a random string from the randomcolor array which the id of the note div will use and gets the corresponding css properties
    generaterandomcolor() {
        // returns random color from the array
        return this.state.randomcolor[Math.floor(Math.random() * this.state.randomcolor.length)];
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
        <div id="notecollector">
            
            <button onClick={ () => {this.clearallnotes(); this.updatecookie();}}>Clear all</button>
            <p>Amount of notes: {this.state.notes.length}</p>

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

            {this.state.notes.map(({title, text, key, color, datecreated}) => (
            <div className="note" id= {color} key={key}>
                <Note title = {title} text = {text}/>
                <button id="removebutton" onClick={ () => {this.removenote(key);}}>X</button>
                <small>{datecreated}</small>
            </div>
            
            ))}
        
        </div>

        );
    } 
  }

// program initialize
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<NoteCollector/>);
