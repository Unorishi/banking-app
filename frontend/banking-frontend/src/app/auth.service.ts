import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  signup(email: string, password: string, name: string): Observable<any> {
  const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        name
        email
      }
    }
  `;

  return this.apollo.mutate({
    mutation: CREATE_USER_MUTATION,
    variables: {
      input: { name, email, password }
    }
  });
}


  login(email: string, password: string): Observable<any> {
    const LOGIN_MUTATION = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            email
          }
        }
      }
    `;

    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password }
    });
  }

  logout() {
    localStorage.removeItem('token');
  }
}
