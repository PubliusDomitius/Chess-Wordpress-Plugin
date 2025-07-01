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
            'pgn'         => '',
            'fen'         => '',
            'moves'       => '',
        ),
        $atts,
        'chess_puzzle'
    );

    ob_start();
        enqueue_chess_puzzle_scripts( $atts );
    ?>
        <div id="chessboard" style="width: <?php echo esc_attr( $atts['width'] ); ?>px"></div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'chess_puzzle', 'display_chess_puzzle' );

function chess_puzzle_register_block() {
    wp_register_script(
        'chess-puzzle-block-editor',
        plugin_dir_url( __FILE__ ) . 'js/block.js',
        array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor' ),
        null,
        true
    );

    register_block_type( 'chess-puzzle/puzzle', array(
        'editor_script'   => 'chess-puzzle-block-editor',
        'render_callback' => 'display_chess_puzzle',
        'attributes'      => array(
            'width'       => array( 'type' => 'string', 'default' => '400' ),
            'orientation' => array( 'type' => 'string', 'default' => 'auto' ),
            'pgn'         => array( 'type' => 'string' ),
            'fen'         => array( 'type' => 'string' ),
            'moves'       => array( 'type' => 'string' ),
        ),
    ) );
}
add_action( 'init', 'chess_puzzle_register_block' );

function enqueue_chess_puzzle_scripts( $params = array() ) {
    $defaults = array(
        'orientation' => 'auto',
        'pgn'         => '',
        'fen'         => '',
        'moves'       => '',
    );
    $params = wp_parse_args( $params, $defaults );
    wp_enqueue_script(
        'chessjs',
        'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.2/chess.js',
        array(),
        '0.10.2',
        true
    );

    wp_enqueue_script( 'chessboard-js', plugin_dir_url( __FILE__ ) . 'js/chessboard-1.0.0.min.js', array( 'jquery' ), '1.0.0', true );
    wp_enqueue_style( 'chessboard-css', plugin_dir_url( __FILE__ ) . 'css/chessboard-1.0.0.min.css' );
    wp_enqueue_style( 'chess-puzzle-css', plugin_dir_url( __FILE__ ) . 'css/plugin.css' );

    wp_enqueue_script( 'chess-puzzle-script', plugin_dir_url( __FILE__ ) . 'js/main.js', array( 'jquery', 'chessboard-js', 'chessjs' ), null, true );

    wp_localize_script(
        'chess-puzzle-script',
        'pluginParams',
        array(
            'pieceThemeBase' => plugin_dir_url( __FILE__ ) . 'img/chesspieces/wikipedia/',
            'orientation'    => $params['orientation'],
            'pgn'            => $params['pgn'],
            'fen'            => $params['fen'],
            'moves'          => $params['moves'],
        )
    );
}



?>

