import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

const mapStateToProps = store => ({
  currentCollection : store.currentCollection,
  url: store.url,
  data : store.data,
});

const mapDispatchToProps = dispatch => ({
  setDBData : (data) => {
    dispatch(actions.setDBData(data));
  }
});

class DocumentFieldRow extends Component {
  constructor(props){
    super(props);
    this.state={
      originalCompleteData : JSON.parse(JSON.stringify(this.props.completeData)),
      updatedValue : JSON.parse(JSON.stringify(this.props.value))
    }
    this.updateNewValue=this.updateNewValue.bind(this);
    this.updateDB = this.updateDB.bind(this);
  }

  updateNewValue = function (e){
    this.setState({
      updatedValue : e.target.value,
    });
  }

  updateDB = function (){
    //update the complete data once
    this.props.data[this.props.Key] = this.state.updatedValue;

    console.log(this.props.completeData);
    console.log(this.state.originalCompleteData);

    //create post object
    let postObj = {
      url : this.props.url,
      newData : this.props.completeData,
      oldData : this.state.originalCompleteData,
      collection : this.props.currentCollection,
    }
    //update db
    fetch(`http://localhost:3000/getdb`,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
      },
      body : JSON.stringify(postObj),
    })
    .then((res) => {
      return res.json()
    })
    .then ((res) => {
      if(res.ConnectionError) {
        console.log('connectionError');
      } else {
        //refresh data after updating db
        fetch(`http://localhost:3000/getdb?url=${this.props.url}`)
        .then((res) => {
          return res.json()
        })
        .then ((res) => {
          if(res.ConnectionError) {
            console.log('connectionError');
          } else {
            console.log('---------Response to client---------\n',res);
            this.props.setDBData(res);
          }
        })
      }
    })
  }


  render(){
    return (
      <div style={styles}>
        <div style={{width : '33%'}}>
          {this.props.Key}
        </div>
        <input style={{width : '33%', textAlign : 'center'}} value={this.state.updatedValue} onChange={(e) => this.updateNewValue(e)} onBlur={this.updateDB}>
        </input>
        {/* <div style={{width : '25%', background: 'cyan', cursor: 'pointer'}} onClick={this.updateDB}>
          Submit Change
        </div> */}
        <div style={{width : '33%'}}>
          {this.props.type}
        </div>
      </div>
    );
  }
}

const styles = { 
  display: 'flex',
  border : '1px solid black',
  marginLeft : '28px',
  textAlign: 'center'
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldRow);