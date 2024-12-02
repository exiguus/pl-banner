import { LogoItem } from '../types/LogoItem';

export class SvgLoader {
  /**
   * Loads all SVGs for the provided items.
   * @param items Array of LogoItem objects.
   * @returns Promise resolving to an array of LogoItem with SVG content.
   */
  static async loadAll(items: LogoItem[]): Promise<LogoItem[]> {
    try {
      // Load all SVGs concurrently
      const loadedItems = await Promise.all(
        items.map(async (item) => this.processItem(item))
      );

      // Filter out any null (failed) items
      return loadedItems.filter((item): item is LogoItem => item !== null);
    } catch (error) {
      console.error('Error loading SVGs:', error);
      return [];
    }
  }

  /**
   * Loads an individual SVG and adds it to the LogoItem.
   * @param item LogoItem to process.
   * @returns Promise resolving to a LogoItem with SVG content or null if failed.
   */
  static async processItem(item: LogoItem): Promise<LogoItem | null> {
    try {
      const svgContent = await this.load(item.path);
      if (!svgContent) {
        console.warn(`SVG not loaded for: ${item.name}`);
        return null;
      }
      return { ...item, svgContent };
    } catch (error) {
      console.error(`Error processing SVG for ${item.name}:`, error);
      return null;
    }
  }

  /**
   * Fetches the SVG content from the given path.
   * @param path URL or path to the SVG file.
   * @returns Promise resolving to the SVG content as a string, or null if failed.
   */
  static async load(path: string): Promise<string | null> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch SVG at ${path} (status: ${response.status})`
        );
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching SVG from ${path}:`, error);
      return null;
    }
  }
}
