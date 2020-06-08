import { LowercasePipe } from "./lowercase.pipe";

describe('Demo for Pipe', () => {
    describe('Test by Itself', () => {
        const pipe = new LowercasePipe();

        it('should create an instance', () => {
            expect(pipe).toBeTruthy();
        });

        it('should convert to lowercase', () => {
            const original = 'ABC';
            const result = pipe.transform(original);
            expect(result).toBe('abc');
        });
    });
});