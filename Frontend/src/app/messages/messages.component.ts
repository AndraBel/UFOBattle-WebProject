import { Component, OnInit } from '@angular/core';
import { MessagesMgrService } from '../shared/services/messages-mgr.service';
import { TokenMgrService } from '../shared/services/token-mgr.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];
  msgId: number = 0;
  origin: string = '';
  target: string = '';
  text: string = '';
  date: string = '';
  deleteQuestion: boolean = false;

  constructor(
    private messagesMgr: MessagesMgrService,
    private tokenMgr: TokenMgrService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const token = this.tokenMgr.getToken();

    if (token) {
      this.messagesMgr.getLastMessages(token).subscribe({
        next: (data) => {
          this.messages = data.map((message) => {
            const newMessage = {
              msgId: message.msgId,
              origin: message.origin,
              target: message.target,
              text: message.text,
              date: new Date(message.date).toLocaleDateString(),
            };
            return newMessage;
          });
          this.toastr.success('Messages retrieved successfully.');
        },
        error: (err) => {
          if (err.status === 401) {
            this.toastr.error('Invalid or expired token. Please log in again.');
          } else {
            this.toastr.error(
              'Failed to retrieve messages. Please try again later.'
            );
          }
        },
      });
    } else {
      this.toastr.error('You must be logged in to view messages.');
    }

    this.createStars();
    this.createFallingStars();
  }

  triggerForm(): void {
    this.deleteQuestion = true;
  }

  cancelDelete(): void {
    this.deleteQuestion = false;
  }

  deleteMessagesAction(): void {
    if (this.messages.length === 1 && this.messages[0].origin === 'admin') {
      this.toastr.warning('The admin message remains!');
      this.deleteQuestion = false;
      return;
    }
    const token = this.tokenMgr.getToken();
    const username = this.tokenMgr.getUsername();

    if (!token || !username) {
      this.toastr.error('You must be logged in to delete messages.');
      this.deleteQuestion = false;
      return;
    }

    this.messagesMgr.deleteMessages(token, username).subscribe({
      next: () => {
        this.toastr.success('Messages deleted successfully.');
        this.deleteQuestion = false;
        location.reload();
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastr.error('Invalid or expired token. Please log in again.');
        } else {
          this.toastr.error(
            'Failed to delete messages. Please try again later.'
          );
        }
        this.deleteQuestion = false;
      },
    });
  }

  createStars(): void {
    const container = document.getElementById('star-container');
    if (container) {
      // Clear existing stars
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Add new stars
      for (let i = 0; i < 300; i++) {
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
