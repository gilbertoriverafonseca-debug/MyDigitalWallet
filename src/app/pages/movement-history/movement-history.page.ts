import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentMethodService } from '../../core/services/payment-method.service';
import { TransactionService } from '../../core/services/transaction.service';
import { MessageService } from '../../core/services/message.service';
import { PaymentMethod } from '../../core/models/payment.model';
import { FinancialRecord } from '../../core/models/movement.model';

const QUICK_REACTIONS = ['🍔', '🛒', '✈️', '🎬', '☕', '💸', '🎁', '⛽', '🏠', '❤️'];

@Component({
  selector: 'app-movement-history',
  templateUrl: './movement-history.page.html',
  styleUrls: ['./movement-history.page.scss'],
  standalone: false,
})
export class MovementHistoryPage {
  private paymentMethodService = inject(PaymentMethodService);
  private transactionService = inject(TransactionService);
  private messageSvc = inject(MessageService);

  quickReactions = QUICK_REACTIONS;

  private methodFilter$ = new BehaviorSubject<string>('');
  private dateFilter$ = new BehaviorSubject<string>('');

  selectedRecordForReaction: FinancialRecord | null = null;

  paymentMethods$: Observable<PaymentMethod[]> = this.paymentMethodService.paymentMethods$();
  private allRecords$ = this.transactionService.financialRecords$();

  filteredRecords$: Observable<FinancialRecord[]> = combineLatest([
    this.allRecords$,
    this.methodFilter$,
    this.dateFilter$,
  ]).pipe(
    map(([records, methodId, dateIso]) => {
      let out = records;
      if (methodId) out = out.filter((r) => r.paymentMethodId === methodId);
      if (dateIso) {
        const d = new Date(dateIso);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const end = start + 86_400_000;
        out = out.filter((r) => r.timestamp >= start && r.timestamp < end);
      }
      return out;
    })
  );

  totalExpense$: Observable<number> = this.filteredRecords$.pipe(
    map((records) => records.reduce((acc, r) => acc + r.transactionAmount, 0))
  );

  handleMethodChange(ev: CustomEvent): void {
    this.methodFilter$.next((ev.detail.value as string) ?? '');
  }

  handleDateChange(dateValue: string): void {
    this.dateFilter$.next(dateValue ?? '');
  }

  resetFilters(): void {
    this.methodFilter$.next('');
    this.dateFilter$.next('');
  }

  openReactionPicker(record: FinancialRecord): void {
    this.selectedRecordForReaction = record;
  }

  closeReactionPicker(): void {
    this.selectedRecordForReaction = null;
  }

  async applyReaction(reaction: string): Promise<void> {
    if (!this.selectedRecordForReaction?.id) return;
    try {
      await this.transactionService.attachReactionEmoji(this.selectedRecordForReaction.id, reaction);
      await this.messageSvc.success('Reacción guardada');
    } catch (e: unknown) {
      await this.messageSvc.error('No se pudo guardar la reacción');
    } finally {
      this.closeReactionPicker();
    }
  }
}
