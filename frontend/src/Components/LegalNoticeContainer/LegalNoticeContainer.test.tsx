import { fireEvent, render } from '@testing-library/preact';
import { LegalNoticeContainer } from './LegalNoticeContainer';

describe('The LegalNoticeContainer', () => {
  it('displays and hides the privacy notice when clicked', () => {
    const { getByText, queryByText } = render(<LegalNoticeContainer />);
    expect(queryByText('Datenschutzerklärung')).toBe(null);
    expect(queryByText('Impressum')).toBe(null);

    fireEvent.click(getByText('privacy notice & imprint'));
    expect(getByText('Datenschutzerklärung')).toBeVisible();
    expect(getByText('Impressum')).toBeVisible();

    fireEvent.click(getByText('privacy notice & imprint'));
    expect(queryByText('Datenschutzerklärung')).toBe(null);
    expect(queryByText('Impressum')).toBe(null);
  });
});
