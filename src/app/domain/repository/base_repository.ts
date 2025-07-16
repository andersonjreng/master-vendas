abstract class BaseRepository<T extends object> {
  abstract getAll(): Promise<T[]>;
}
