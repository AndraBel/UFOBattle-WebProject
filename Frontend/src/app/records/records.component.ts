import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { RecordsMgrService } from '../shared/services/records-mgr.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { style } from '@angular/animations';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css',
})
export class RecordsComponent implements OnInit {
  username: string = '';
  punctuation: number = 0;
  ufos: number = 0;
  disposedTime: number = 0;
  recordDate: string = '';
  records: any[] = [];

  constructor(
    private recordsService: RecordsMgrService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.recordsService.getRecords().subscribe({
      next: (response) => {
        this.records = response.map((record) => {
          // Create a new object step-by-step
          const newRecord = {
            player: record.username,
            ufos: record.ufos,
            time: record.disposedTime,
            punctuation: record.punctuation,
            // Add the formattedDate property
            formattedDate: new Date(record.recordDate).toLocaleString(),
          };
          return newRecord;
        });
      },
      error: (err) => {
        console.log('Error');
      },
    });
    this.createStars();
    this.createFallingStars();
  }

  createStars(): void {
    const container = document.getElementById('star-container');
    if (container) {
      // Clear existing stars
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Add new stars
      for (let i = 0; i < 1000; i++) {
        const star = this.renderer.createElement('div');
        this.renderer.addClass(star, 'star');

        const x = Math.random() * 100; // Random x-axis position
        const y = Math.random() * 100; // Random y-axis position
        const size = Math.random() * 3 + 1; // Random size
        const delay = Math.random() * 5; // Random animation delay

        this.renderer.setStyle(star, 'top', `${y}vh`);
        this.renderer.setStyle(star, 'left', `${x}vw`);
        this.renderer.setStyle(star, 'width', `${size}px`);
        this.renderer.setStyle(star, 'height', `${size}px`);
        this.renderer.setStyle(star, 'animation-delay', `${delay}s`);
        container.appendChild(star);

        // Randomly trigger falling behavior after a delay
        setTimeout(() => {
          if (Math.random() < 0.05) {
            this.renderer.addClass(star, 'falling');
          }
        }, delay * 1000); // Add delay before triggering falling
      }
    } else {
      console.error('Star container not found in the DOM.');
    }
  }

  createFallingStars(): void {
    const container = document.getElementById('star-container');
    if (!container) return;

    setInterval(() => {
      const fallingStar = this.renderer.createElement('div');
      this.renderer.addClass(fallingStar, 'star');
      this.renderer.addClass(fallingStar, 'falling');

      // Randomize starting positions
      const randomX = Math.random() * 100; // Random horizontal position (percentage)
      const randomY = Math.random() * 100; // Random vertical position (percentage)
      const size = Math.random() * 3 + 1; // Random size for the star

      // Set random initial positions and size
      this.renderer.setStyle(fallingStar, 'top', `${randomY}vh`); // Start from a random vertical position
      this.renderer.setStyle(fallingStar, 'left', `${randomX}vw`); // Random horizontal position
      this.renderer.setStyle(fallingStar, 'width', `${size}px`);
      this.renderer.setStyle(fallingStar, 'height', `${size}px`);

      container.appendChild(fallingStar);

      // Remove the star after its animation ends to prevent overflow
      setTimeout(() => {
        if (fallingStar.parentElement) {
          container.removeChild(fallingStar);
        }
      }, 10000); // Match the duration of the vaultFall animation
    }, 500); // Generate a new falling star every 500ms
  }
}
