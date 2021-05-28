import { Component, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Subject, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

  private categorySelectedSubject = new BehaviorSubject<number>(null);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // $ denotes an observable
  products$ = combineLatest([
    this.productService.productWithCategory$,
    this.categorySelectedAction$,
  ])
    .pipe(
      map(([products, selectedCategoryId]) => {
        return products.filter(item =>
          selectedCategoryId ? item.categoryId === selectedCategoryId : true)
      }),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    )
  sub: Subscription;

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }
  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
