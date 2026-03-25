import React from 'react';
import { render } from '@testing-library/react-native';
import { QAAssistant } from '../src/QAAssistant';
import * as deps from '../src/deps';
import { ABTastyQA } from '@flagship.io/react-native-sdk';

// Mock dependencies
jest.mock('../src/deps');
jest.mock('../src/QAAssistantContent', () => ({
  QAAssistantContent: jest.fn(() => null),
}));

describe('QAAssistant', () => {
  let mockABTastyQA: ABTastyQA;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    mockABTastyQA = {
      envId: 'test-env-123',
      isQAModeEnabled: true,
      ABTastyQAEventBus: {
        emitQAEventToSDK: jest.fn(),
        onQAEventFromSDK: jest.fn(() => jest.fn()),
      },
    } as any;
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should render QAAssistantContent when all conditions are met', () => {
    (deps.useABTastyQA as jest.Mock).mockReturnValue(mockABTastyQA);

    render(<QAAssistant />);
    const QAAssistantContent = require('../src/QAAssistantContent').QAAssistantContent;

    expect(QAAssistantContent).toHaveBeenCalled();
  });


  it('should return null and warn when ABTastyQA is not available', () => {
    (deps.useABTastyQA as jest.Mock).mockReturnValue(null);

    render(<QAAssistant />);
    const QAAssistantContent = require('../src/QAAssistantContent').QAAssistantContent;

    expect(QAAssistantContent).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('not able to access the Flagship SDK instance'));
  });

  it('should return null and warn when QA mode is not enabled', () => {
    const mockABTastyQAWithoutQAMode = { ...mockABTastyQA, isQAModeEnabled: false };
    (deps.useABTastyQA as jest.Mock).mockReturnValue(mockABTastyQAWithoutQAMode);

    render(<QAAssistant />);
    const QAAssistantContent = require('../src/QAAssistantContent').QAAssistantContent;

    expect(QAAssistantContent).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Flagship SDK is not in QA mode'));
  });

  it('should return null and warn when envId is missing', () => {
    const mockABTastyQAWithoutEnvId = { ...mockABTastyQA, envId: undefined };
    (deps.useABTastyQA as jest.Mock).mockReturnValue(mockABTastyQAWithoutEnvId);

    render(<QAAssistant />);
    const QAAssistantContent = require('../src/QAAssistantContent').QAAssistantContent;

    expect(QAAssistantContent).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('not configured with a valid environment ID'));
  });

  it('should merge user config with default config', () => {
    (deps.useABTastyQA as jest.Mock).mockReturnValue(mockABTastyQA);

    render(<QAAssistant config={{ position: 'top-left' }} />);
    const QAAssistantContent = require('../src/QAAssistantContent').QAAssistantContent;

    expect(QAAssistantContent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          position: 'top-left',
          floatingButton: true,
        }),
        ABTastQA: mockABTastyQA,
      }),
      undefined
    );
  });

  it('should pass ABTastyQA to QAAssistantContent', () => {
    (deps.useABTastyQA as jest.Mock).mockReturnValue(mockABTastyQA);

    render(<QAAssistant />);
    const QAAssistantContent = require('../src/QAAssistantContent').QAAssistantContent;

    expect(QAAssistantContent).toHaveBeenCalledWith(
      expect.objectContaining({
        ABTastQA: mockABTastyQA,
        config: expect.any(Object),
      }),
      undefined
    );
  });

  it('should handle custom config with floatingButton disabled', () => {
    (deps.useABTastyQA as jest.Mock).mockReturnValue(mockABTastyQA);

    render(<QAAssistant config={{ floatingButton: false }} />);
    const QAAssistantContent = require('../src/QAAssistantContent').QAAssistantContent;

    expect(QAAssistantContent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          floatingButton: false,
        }),
        ABTastQA: mockABTastyQA,
      }),
      undefined
    );
  });

  it('should not render multiple warnings when all conditions fail', () => {
    (deps.useABTastyQA as jest.Mock).mockReturnValue(null);

    render(<QAAssistant />);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('not able to access the Flagship SDK instance'));
  });

  it('should render warnings for both QA mode and envId when both are missing', () => {
    const mockABTastyQAInvalid = { ...mockABTastyQA, isQAModeEnabled: false, envId: undefined };
    (deps.useABTastyQA as jest.Mock).mockReturnValue(mockABTastyQAInvalid);

    render(<QAAssistant />);

    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Flagship SDK is not in QA mode'));
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('not configured with a valid environment ID'));
  });
});
