 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/loans`;

  constructor(private http: HttpClient) {}

  getAllLoans(): Observable<Loan[]> {
    // In a real app, this would be an admin-specific endpoint
    return this.http.get<Loan[]>(`${this.apiUrl}/admin/all`);
  }

  updateLoanStatus(loanId: string, status: string): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiUrl}/${loanId}/status`, { status });
  }
}
