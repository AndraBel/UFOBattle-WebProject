import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { PlayMgrService } from '../shared/services/play-mgr.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TokenMgrService } from '../shared/services/token-mgr.service';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css',
})
export class PlayComponent implements OnInit, OnDestroy {
  time: number = 0;
  score: number = 0;
  ufos: number = 0;
  intervalId: any;
  endOfTheGame: boolean = false;
  showYesButton: boolean = true;
  endText: string = 'Do you want to save your score?';

  missile: HTMLElement | null = null;
  alreadyPulled: boolean = false;
  pid: any;
  ufoList: HTMLElement[] = [];
  themissile: HTMLElement | null = null;
  missileIntervalId: any[] = [];

  constructor(
    private renderer: Renderer2,
    private playService: PlayMgrService,
    private toastr: ToastrService,
    private tokenMgr: TokenMgrService,
    private router: Router
  ) {}

  handleYesClick() {
    this.showYesButton = false;
    this.endText = 'What do you want to do next?';
  }

  ngOnInit() {
    if (!this.tokenMgr.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      this.toastr.error('You must be logged in to play the game.');
      return;
    }
    this.time = this.playService.getTime('time');
    this.ufos = this.playService.getUfos('ufos');

    this.missile = document.getElementById('missile');
    this.themissile = this.missile; // Alias for collision checks
    document.addEventListener('keydown', (event) =>
      this.keyboardController(event)
    );

    this.initializeGame();

    this.startTimer();

    this.createStars();
    this.createFallingStars();
  }

  ngOnDestroy(): void {
    // Clear all active intervals
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.pid) {
      clearInterval(this.pid);
    }
    this.missileIntervalId.forEach((id) => clearInterval(id));
    this.missileIntervalId = [];
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.time--;
      if (this.time <= 0) {
        clearInterval(this.intervalId);
        this.endGame();
      }
    }, 1000);
  }

  endGame(): void {
    this.score = this.calculateFinalScore();

    this.endOfTheGame = true;
  }

  goodbye(): void {
    this.toastr.info('Goodbye! Thank you for playing, see you!');
  }

  calculateFinalScore(): number {
    const baseScore = this.score;
    const disposedTime = this.playService.getTime('time');
    const penalty = (this.ufos - 1) * 50;
    let finalScore = Math.round(baseScore / (disposedTime / 60)) - penalty;

    return finalScore > 0 ? finalScore : 0;
  }

  saveScore() {
    const disposedTime = this.playService.getTime('time');

    if (this.score === 0) {
      this.toastr.error('The score is 0. It will not be saved.');
      return;
    }

    this.playService
      .recordScore(this.score, this.ufos, disposedTime)
      .subscribe({
        next: (response) => {
          this.toastr.success('The score has been saved!');
        },
        error: (error) => {
          this.toastr.error('Failed to save the score.');
        },
      });
  }

  createStars(): void {
    const container = document.getElementById('star-containerr');
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
    const container = document.getElementById('star-containerr');
    if (!container) return;

    const starInterval = setInterval(() => {
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
    }, 1000); // Generate a new falling star every 500ms

    this.missileIntervalId.push(starInterval);
  }

  initializeGame(): void {
    this.createUFOs(this.ufos);
    this.launchUFOs();
  }

  createUFOs(count: number): void {
    const container = document.getElementById('container');
    if (!container || !this.missile) return;

    // Get missile properties for constraints
    const missileBottom = parseInt(this.missile.style.bottom || '0', 10);
    const heightM = parseInt(this.missile.style.height || '0', 10);
    const navHeight = document.querySelector('nav')?.offsetHeight || 0;

    const widthUFO = 60; // Fixed width of the UFO
    const heightUFO = 60; // Fixed height of the UFO

    for (let i = 0; i < count; i++) {
      const ufo = this.renderer.createElement('img');
      this.renderer.setAttribute(ufo, 'src', '/resources/newUFO.png');
      this.renderer.addClass(ufo, 'setOfUfos');
      this.renderer.setStyle(ufo, 'position', 'absolute');
      this.renderer.setStyle(ufo, 'z-index', '0'); // Ensure UFOs are behind score panel

      const rLimit = window.innerWidth;
      const uLimit = window.innerHeight;

      // Calculate the minimum bottom position based on missile position and height
      const minBottom = missileBottom + heightM + 100;
      const maxBottom = uLimit - navHeight - heightUFO;

      // Ensure UFOs don't overlap with the missile area or go out of bounds
      const newLeft = Math.floor(Math.random() * (rLimit - widthUFO));
      const newBottom = Math.max(
        minBottom,
        Math.floor(Math.random() * (maxBottom - minBottom)) + minBottom
      );

      // Randomly assign movement direction
      const randomClass = Math.random() < 0.5 ? 'move-right' : 'move-left';
      this.renderer.addClass(ufo, randomClass);

      // Append the UFO to the container
      container.appendChild(ufo);
      this.ufoList.push(ufo);
      // Set positions for the UFO
      this.renderer.setStyle(ufo, 'left', `${newLeft}px`);
      this.renderer.setStyle(ufo, 'bottom', `${newBottom}px`);

      // Calculate and set top position based on bottom value
      const newTop = uLimit - newBottom - heightUFO;
      this.renderer.setStyle(ufo, 'top', `${newTop}px`);
    }
  }

  // /**
  //  * Launch the UFOs.
  //  */
  // launchUFOs(): void {
  //   this.ufoList.forEach((ufo) => {
  //     const ufoInterval = setInterval(() => this.moveUFO(ufo), 30);
  //     this.missileIntervalId.push(ufoInterval);
  //   });
  // }

  /**
   * Launch the UFOs.
   */
  launchUFOs(): void {
    this.ufoList.forEach((ufo) => {
      this.animateUFO(ufo);
    });
  }

  animateUFO(ufo: HTMLElement): void {
    const move = () => {
      this.moveUFO(ufo); // Move logic for each frame
      requestAnimationFrame(move); // Recursively request next frame
    };

    requestAnimationFrame(move); // Start the animation loop
  }

  /**
   * Move the UFOs and handle boundary reversal.
   */
  moveUFO(ufo: HTMLElement): void {
    const Rlimit = window.innerWidth;
    const MARGIN = 8;

    let hposUfo = parseInt(ufo.style.left || '0', 10);
    const widthUfo = ufo.offsetWidth;

    // Reverse direction at boundaries
    if (hposUfo + widthUfo + MARGIN > Rlimit || hposUfo < MARGIN) {
      if (ufo.classList.contains('move-right')) {
        ufo.classList.remove('move-right');
        ufo.classList.add('move-left');
      } else if (ufo.classList.contains('move-left')) {
        ufo.classList.remove('move-left');
        ufo.classList.add('move-right');
      }
    }

    // Update horizontal position
    hposUfo += ufo.classList.contains('move-right') ? 8 : -8;
    this.renderer.setStyle(ufo, 'left', `${hposUfo}px`);
  }

  keyboardController(event: KeyboardEvent): void {
    if (!this.themissile) return;

    if (this.endOfTheGame) return;

    // Prevent horizontal movement if the missile is already launched
    if (
      this.alreadyPulled &&
      (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
    ) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        this.moveMissileRight();
        break;
      case 'ArrowLeft':
        this.moveMissileLeft();
        break;
      case ' ':
        if (!this.alreadyPulled) {
          this.launchMissile();
        }
        break;
    }
  }

  launchMissile(): void {
    if (!this.missile) return;

    this.alreadyPulled = true;
    this.pid = setInterval(() => this.updateMissilePosition(), 10);
  }

  moveMissileRight(): void {
    if (!this.themissile) return;

    const rightLimit = window.innerWidth;
    let left = parseInt(this.themissile.style.left || '0', 10);

    if (left + this.themissile.offsetWidth + 15 < rightLimit) {
      this.renderer.setStyle(this.themissile, 'left', `${left + 15}px`);
    }
  }

  moveMissileLeft(): void {
    if (!this.themissile) return;

    let left = parseInt(this.themissile.style.left || '0', 10);

    if (left - 15 > 0) {
      this.renderer.setStyle(this.themissile, 'left', `${left - 15}px`);
    }
  }

  applyPenalty(penalty: number): void {
    this.score = Math.max(this.score - penalty, 0); // Ensure score doesn't go below 0
  }

  updateScore(points: number): void {
    this.score += points;
  }

  updateMissilePosition(): void {
    if (!this.themissile) return;

    let bottom = parseInt(this.themissile.style.bottom || '0', 10);
    bottom += 5;

    // Check for collision
    const hitUFO = this.checkForHit();
    if (hitUFO) {
      this.handleCollision(hitUFO); // Handle the collision
      this.updateScore(100); // Increase score by 100 for a hit
      // return; // Stop further movement of the missile
      this.resetMissile();
      return;
    }

    // Check if missile goes out of bounds
    if (bottom >= window.innerHeight) {
      this.resetMissile(); // Reset missile if it reaches the top
      this.applyPenalty(25); // Apply a penalty for missing all UFOs
      return;
    }

    // Update missile's bottom position
    this.renderer.setStyle(this.themissile, 'bottom', `${bottom}px`);
  }

  resetMissile(): void {
    if (!this.themissile) return;

    clearInterval(this.pid); // Stop the missile's movement
    this.alreadyPulled = false; // Allow firing again
    this.renderer.setStyle(this.themissile, 'bottom', '0px'); // Reset position
  }

  checkForHit(): HTMLElement | null {
    for (const ufo of this.ufoList) {
      if (this.isCollision(ufo)) {
        return ufo;
      }
    }
    return null;
  }

  /**
   * Detect collision between missile and UFO.
   */
  isCollision(ufo: HTMLElement): boolean {
    const missileRect = this.themissile?.getBoundingClientRect();
    const ufoRect = ufo.getBoundingClientRect();

    if (!missileRect || !ufoRect) {
      return false; // Explicitly return false when either rectangle is undefined
    }

    return (
      missileRect.left < ufoRect.right &&
      missileRect.right > ufoRect.left &&
      missileRect.top < ufoRect.bottom &&
      missileRect.bottom > ufoRect.top
    );
  }

  /**
   * Handle collision between missile and UFO.
   */
  handleCollision(ufo: HTMLElement): void {
    // Save the original source of the UFO image
    const ufoImage = ufo as HTMLImageElement;

    // Temporarily change the UFO image to an explosion
    ufoImage.src = '/resources/explosion.gif';

    setTimeout(() => {
      ufoImage.src = '/resources/newUFO.png';
    }, 1000);
  }

  resetGame(): void {
    // Clear intervals
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.pid) {
      clearInterval(this.pid);
    }

    // Reset game properties
    this.time = this.playService.getTime('time'); // Or set to initial value
    this.score = 0;
    this.ufos = this.playService.getTime('ufos'); // Or set to initial value
    this.endOfTheGame = false;
    this.showYesButton = true;
    this.endText = 'Do you want to save your score?';
    this.alreadyPulled = false;

    // Remove all UFO elements
    const container = document.getElementById('container');
    if (container) {
      this.ufoList.forEach((ufo) => ufo.remove());
    }
    this.ufoList = [];

    // Reset missile position
    if (this.missile) {
      this.renderer.setStyle(this.missile, 'bottom', '10px');
      this.renderer.setStyle(this.missile, 'left', '300px');
    }

    // Reinitialize the game
    this.initializeGame();
    this.startTimer();
  }
}
