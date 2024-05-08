#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';

interface Student {
  name: string;
  id: string;
  courses: string[];
  balance: number;
}

class StudentManagementSystem {
  students: Student[] = [];
  idCounter: number = 10001;

  courses: { [key: string]: number } = {
    'Web Development': 300,
    'Graphic Designing': 150,
    'Database Management': 250,
    'Software Engineering': 250,
    'Cybersecurity': 200,
  };

  constructor() {
    this.start();
  }

  async start() {
    while (true) {
      const answer = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Select an option:',
        choices: [
          'Add Student',
          'Enroll Student',
          'View Balance',
          'Pay Tuition Fees',
          'Show Status',
          'Exit',
        ],
      });
      const choice = answer.choice as string;

      switch (choice) {
        case 'Add Student':
          await this.addStudent();
          break;
        case 'Enroll Student':
          await this.enrollStudent();
          break;
        case 'View Balance':
          await this.viewBalance();
          break;
        case 'Pay Tuition Fees':
          await this.payFees();
          break;
        case 'Show Status':
          await this.showStatus();
          break;
        case 'Exit':
          console.log('Exiting program...');
          process.exit(0);
      }
    }
  }

  async addStudent() {
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: chalk.blue('Enter student name:'),
    });

    const student: Student = {
      name,
      id: this.generateStudentID(),
      courses: [],
      balance: 0,
    };

    this.students.push(student);
    console.log(chalk.green('Student added successfully!'));
  }

  generateStudentID(): string {
    const id = this.idCounter.toString().padStart(5, '0');
    this.idCounter++;
    return id;
  }

  async enrollStudent() {
    const studentChoices = this.students.map((student) => ({
      name: student.name,
      value: student,
    }));

    const { selectedStudent } = await inquirer.prompt({
      type: 'list',
      name: 'selectedStudent',
      message: chalk.blue('Select a student to enroll:'),
      choices: studentChoices,
    });

    const { selectedCourse } = await inquirer.prompt({
      type: 'list',
      name: 'selectedCourse',
      message: chalk.blue('Select course name to enroll:'),
      choices: Object.keys(this.courses)
    });

    const courseFee = this.courses[selectedCourse]; 
    selectedStudent.balance += courseFee; 
    selectedStudent.courses.push(selectedCourse);
    console.log(chalk.green(`${selectedStudent.name} enrolled in "${selectedCourse}" course  successfully!`));
  }

  async viewBalance() {
    const studentChoices = this.students.map((student) => ({
      name: student.name,
      value: student,
    }));

    const { selectedStudent } = await inquirer.prompt({
      type: 'list',
      name: 'selectedStudent',
      message: chalk.blue('Select a student to view balance:'),
      choices: studentChoices,
    });

    console.log(`Balance for ${selectedStudent.name}: $${selectedStudent.balance}`);
  }

  async payFees() {
    const studentChoices = this.students.map((student) => ({
      name: student.name,
      value: student,
    }));

    const { selectedStudent } = await inquirer.prompt({
      type: 'list',
      name: 'selectedStudent',
      message: chalk.blue('Select a student to pay fees:'),
      choices: studentChoices,
    });

    const { amount } = await inquirer.prompt({
      type: 'number',
      name: 'amount',
      message: chalk.blue('Enter amount to pay:'),
    });

    selectedStudent.balance -= amount;
    console.log(`$${amount} paid successfully. Remaining balance: $${selectedStudent.balance}`);
  }

  async showStatus() {
    const studentChoices = this.students.map((student) => ({
      name: student.name,
      value: student,
    }));

    const { selectedStudent } = await inquirer.prompt({
      type: 'list',
      name: 'selectedStudent',
      message: chalk.blue('Select a student to view status:'),
      choices: studentChoices,
    });

    console.log(chalk.green('Student Details:'));
    console.log(chalk.blue(`Name: (${selectedStudent.name})`));
    console.log(chalk.blue(`ID: ${selectedStudent.id}`));
    console.log(chalk.blue(`Courses Enrolled: ${selectedStudent.courses.join(', ')}`));
    console.log(chalk.blue(`Balance: $${selectedStudent.balance}`));
  }
}

new StudentManagementSystem();
