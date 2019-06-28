import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HelloComponent } from './hello.component';

import { TestComponent } from './test.component';
import { FictionlogComponent } from './fictionlog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ 
    
  ],
  imports: [
    FormsModule,
    RouterModule.forRoot([
      { path: 'b/:id', component: FictionlogComponent },
      { path: 't', component: TestComponent },
      { path: '', component: HelloComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}


