<?php
/*
Plugin Name: Chess Puzzle Vision
Description: A plugin to train to see checks, captures and threats.
Version: 1.0
Author: TADLAOUI Hamza
*/

function display_chess_puzzle( $atts = array() ) {
    $atts = shortcode_atts(
        array(
            'width'       => '400',
            'orientation' => 'auto',
        ),
        $atts,
        'chess_puzzle'
    );

    ob_start();
        enqueue_chess_puzzle_scripts( $atts['orientation'] );
    ?>
        <div id="chessboard" style="width: <?php echo esc_attr( $atts['width'] ); ?>px"></div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'chess_puzzle', 'display_chess_puzzle' );

function enqueue_chess_puzzle_scripts( $orientation = 'auto' ) {
    wp_enqueue_script(
        'chessjs',
        'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.2/chess.js',
        array(),
        '0.10.2',
        true
    );

    wp_enqueue_script( 'chessboard-js', plugin_dir_url( __FILE__ ) . 'js/chessboard-1.0.0.min.js', array( 'jquery' ), '1.0.0', true );
    wp_enqueue_style( 'chessboard-css', plugin_dir_url( __FILE__ ) . 'css/chessboard-1.0.0.min.css' );

    wp_enqueue_script( 'chess-puzzle-script', plugin_dir_url( __FILE__ ) . 'js/main.js', array( 'jquery', 'chessboard-js', 'chessjs' ), null, true );

    wp_localize_script(
        'chess-puzzle-script',
        'pluginParams',
        array(
            'pieceThemeBase' => plugin_dir_url( __FILE__ ) . 'img/chesspieces/wikipedia/',
            'orientation'    => $orientation,
        )
    );
}



?>

