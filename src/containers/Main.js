import React, { Component } from 'react';
import { getAllStudents, getAsses, getFreshies } from '../services/getGrades';
import Students from '../components/student/Students';
import Asses from '../components/asses/Asses';
import styles from './main.css';
import loading from '../../assets/loading.gif';
import scorpion from '../../assets/scorpion.png';
import ApiForm from '../components/form/ApiForm';

class Main extends Component {
  state = {
    students: [],
    studentAsses: null,
    studentLoading: false,
    assLoading: false,
    apiKey: null,
    err: null,
    assErr: null,
    tas: null,
    filterTa: null
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.setState({ 
      studentLoading: true,
      studentAsses: null,
      filterTa: null
    });
    getAllStudents(this.state.apiKey)
      .then(students => this.setState({ 
        students,
        studentLoading: false, 
        tas: [...new Set(students.map(i => i.section).flat())]
      }))
      .catch(err => this.setState({ 
        err,
        studentLoading: false
      }));
  }

  handleClick = (kido) => {
    this.setState({ 
      assLoading: true,
      studentAsses: null,
      assErr: null
    });
    getAsses(kido, this.state.apiKey)
      .then(asses => this.setState({
        studentAsses: asses,
        assLoading: false
      }))
      .catch(err => this.setState({ 
        assErr: err,
        assLoading: false
      }));
  }

  handleStudentSelect(e) {
    const selected = document.querySelector(`.${styles.selected}`);
    if(selected) selected.className = selected.className.replace(styles.selected, '').replace(' ', '');
    e.currentTarget.className = `${e.currentTarget.className} ${styles.selected}`;
  }

  getFreshData = () => {
    this.setState({
      studentLoading: true,
      students: [],
      studentAsses: null,
      filterTa: null
    });
    getFreshies(this.state.apiKey)
      .then(students => this.setState({ 
        students,
        studentLoading: false,
        tas: [...new Set(students.map(i => i.section).flat())]
      }))
      .catch(err => this.setState({ 
        err,
        studentLoading: false,
      }));
  }

  render() {
    if(this.state.studentLoading) {
      return (
        <section className={styles.loading}>
          <img src={loading} />
        </section>
      );
    }
    if(this.state.err) {
      return (
        <>
          <ApiForm tas={this.state.tas} handleChange={this.handleChange} handleFormSubmit={this.handleFormSubmit} getFreshData={this.getFreshData} />
          <h2>Could not fetch</h2>
        </>
      );
    }
    return (
      <>
        <ApiForm tas={this.state.tas} handleChange={this.handleChange} handleFormSubmit={this.handleFormSubmit} getFreshData={this.getFreshData} />
        {this.state.apiKey && <section className={styles.bigGuy}>
          {!this.state.studentLoading && <Students filterTa={this.state.filterTa} students={this.state.students} selectStudent={this.handleClick} handleStudentSelect={this.handleStudentSelect}/>}
          {this.state.studentAsses && <Asses asses={this.state.studentAsses}/>}
          {this.state.assLoading && <div className={styles.scorpLoader}><img src={scorpion} /></div>}
          {this.state.assErr && <h2>Error loading asses</h2>}
        </section>}
      </>
    );
  
  }
}

export default Main;
