import { PhonenumberPipe } from './phone.number.pipe';

describe('PhonenumberPipe', () => {
    it('create an instance', () => {
        const pipe = new PhonenumberPipe();
        expect(pipe).toBeTruthy();
    });

    it('should display in phone format', () => {
        const phoneNumber = '9004185509';

        const pipe = new PhonenumberPipe();

        const result = pipe.transform(phoneNumber);

        expect(result).toBe('(900) 418 5509');

    });
});
