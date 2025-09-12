import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Observable } from 'rxjs';
import { User } from '../../store/auth/auth.state';

interface DashboardStats {
  totalUsers: number;
  totalAccounts: number;
  totalLoans: number;
  pendingLoans: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  stats: DashboardStats = {
    totalUsers: 0,
    totalAccounts: 0,
    totalLoans: 0,
    pendingLoans: 0,
    totalDeposits: 0,
    totalWithdrawals: 0
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {
     this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    // In a real application, you would have admin-specific endpoints
    // For now, we'll simulate the stats
    setTimeout(() => {
      this.stats = {
        totalUsers: 150,
        totalAccounts: 340,
        totalLoans: 85,
        pendingLoans: 12,
        totalDeposits: 2500000,
        totalWithdrawals: 1800000
      };
      this.loading = false;
    }, 1000);
  }
}
