angular.module('appleCalculator', [])
    .controller('Calculator', ['$scope', Calculator]);

function Calculator($scope) {
    $scope.console = 0;
    
    var _total = 0;
    var _state = null;

    // Web Audio API se digital sound generate karna (No external files needed)
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound() {
        // Browser strict autoplay policy ko bypass karne ke liye context resume karna
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        
        // Retro 8-bit/mechanical sound ke liye square wave ka use
        oscillator.type = 'square'; 
        
        // Frequency set karna (150Hz se shuru hoke 0.1 second me 40Hz tak drop hogi)
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
        
        // Volume (Gain) control karna taaki awaz sharp click jaisi aaye
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
    
    function _resolveState() {
        if ($scope.console === "ОШИБКА") return; 

        switch (_state) {
            case 'ADD':
                _total += parseFloat($scope.console);
                $scope.console = 0;
                break;
            case 'SUB':
                _total -= parseFloat($scope.console);
                $scope.console = 0;
                break;
            case 'MULT':
                _total *= parseFloat($scope.console);
                $scope.console = 0;
                break;
            case 'DIV':
                if (parseFloat($scope.console) === 0) {
                    $scope.console = "ОШИБКА"; // Russian for ERROR, fits the USSR theme!
                    _total = 0;
                    return; 
                }
                _total /= parseFloat($scope.console);
                $scope.console = 0;
                break;
                
            default:
                _total = parseFloat($scope.console);
                $scope.console = 0;
                break;
                
        }
    }

    $scope.add = function() {
        playSound();
        _resolveState();
        if ($scope.console !== "ОШИБКА") _state = 'ADD';
    }
    
    $scope.subtract = function() {
        playSound();
        _resolveState();
        if ($scope.console !== "ОШИБКА") _state = 'SUB';
    }
    
    $scope.multiply = function() {
        playSound();
        _resolveState();
        if ($scope.console !== "ОШИБКА") _state = 'MULT';
    }
    
    $scope.divide = function() {
        playSound();
        _resolveState();
        if ($scope.console !== "ОШИБКА") _state = 'DIV';
    }
    
    $scope.equal = function() {
        playSound();
        _resolveState();
        if ($scope.console !== "ОШИБКА") {
            $scope.console = _total;
        }
        _state = 'EQ';
    }
    
    $scope.print = function(n) {
        playSound();
        if ($scope.console === "ОШИБКА" || $scope.console.toString() === "0" || _state === 'EQ') {
            $scope.console = "";
        }
        if (_state === 'EQ' || $scope.console === "ОШИБКА") {
            _state = null;
        }
        
        if ($scope.console.toString().length < 10) {
            $scope.console = $scope.console + n;
        }
    }
    
    $scope.changePositivity = function() {
        playSound();
        if ($scope.console !== "ОШИБКА" && $scope.console.toString() !== "0") {
            $scope.console = (parseFloat($scope.console) * -1).toString();
        }
    }
    
    $scope.getPercentage = function() {
        playSound();
        if ($scope.console !== "ОШИБКА") {
            $scope.console = (parseFloat($scope.console) * .01).toString();
        }
    }
    
    $scope.clearTotal = function() {
        playSound();
        $scope.console = 0;
        _total = 0;
        _state = null;
    }
}
