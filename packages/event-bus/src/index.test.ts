import { describe, it, expect, vi } from 'vitest';
import { createEventBus } from './index';

describe('event-bus', () => {
  it('вызывает подписчика при emit', () => {
    const bus = createEventBus();
    const handler = vi.fn();
    bus.on('catalog:book-opened', handler);
    bus.emit('catalog:book-opened', { bookId: '1', authorId: 'a', timestamp: 0 });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('replay: подписка после emit получает пропущенное событие', () => {
    const bus = createEventBus();
    bus.emit('catalog:book-opened', { bookId: '1', authorId: 'a', timestamp: 0 });
    const handler = vi.fn();
    bus.on('catalog:book-opened', handler); // подписка ПОСЛЕ
    expect(handler).toHaveBeenCalledOnce(); // но handler получил событие
  });

  it('replay: только события своего типа', () => {
    const bus = createEventBus();
    bus.emit('catalog:book-opened', { bookId: '1', authorId: 'a', timestamp: 0 });
    bus.emit('authors:author-selected', { authorId: 'a' });
    const handler = vi.fn();
    bus.on('catalog:book-opened', handler);
    expect(handler).toHaveBeenCalledOnce(); // только один раз, не два
  });

  it('отписка через возвращённую функцию', () => {
    const bus = createEventBus();
    const handler = vi.fn();
    const off = bus.on('catalog:book-opened', handler);
    off();
    bus.emit('catalog:book-opened', { bookId: '1', authorId: 'a', timestamp: 0 });
    expect(handler).not.toHaveBeenCalled();
  });

  it('onAny получает все события', () => {
    const bus = createEventBus();
    const handler = vi.fn();
    bus.onAny(handler);
    bus.emit('catalog:book-opened', { bookId: '1', authorId: 'a', timestamp: 0 });
    bus.emit('authors:author-selected', { authorId: 'a' });
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('bufferSize ограничивает replay', () => {
    const bus = createEventBus({ bufferSize: 2 });
    bus.emit('catalog:book-opened', { bookId: '1', authorId: 'a', timestamp: 0 });
    bus.emit('catalog:book-opened', { bookId: '2', authorId: 'a', timestamp: 0 });
    bus.emit('catalog:book-opened', { bookId: '3', authorId: 'a', timestamp: 0 });
    const handler = vi.fn();
    bus.on('catalog:book-opened', handler);
    expect(handler).toHaveBeenCalledTimes(2); // только последние два
  });

  it('clear очищает подписки и буфер', () => {
    const bus = createEventBus();
    const handler = vi.fn();
    bus.on('catalog:book-opened', handler);
    bus.emit('catalog:book-opened', { bookId: '1', authorId: 'a', timestamp: 0 });
    handler.mockClear();
    bus.clear();
    bus.emit('catalog:book-opened', { bookId: '2', authorId: 'a', timestamp: 0 });
    expect(handler).not.toHaveBeenCalled();
  });
});